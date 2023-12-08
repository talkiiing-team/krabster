import axios from 'axios'
import jsdom from 'jsdom'
import ytdl from 'ytdl-core'
import { PlatformDownloadApi } from '@sovok/server/download-pipeline/application'
import { createFakeHeaders } from '@sovok/server/shared/fake-headers'
import { getArtistsString } from '@sovok/shared'

const YOUTUBE_HEADERS = {
  ...createFakeHeaders({
    origin: 'https://www.youtube.com',
    referer: 'https://www.youtube.com/',
    host: 'www.youtube.com',
  }),

  'X-YouTube-Client-Name': '1',
  'X-YouTube-Client-Version': '2.20211110.00.00',
  'Content-Type': 'text/html; charset=utf-8',
}

const MAX_VIDEO_DURATION_MS = 2 * 60 * 60 * 1000
const MAX_VIDEO_DURATION_DEVIATION_MS = 30 * 1000

const isValidVideoTitle = (videoName: string, query: string) =>
  ['cover', 'remix', 'playlist', 'double', 'dual'].every(
    keyword =>
      !(
        (videoName.toLowerCase().includes(keyword) &&
          !query.toLowerCase().includes(keyword)) ||
        (!videoName.toLowerCase().includes(keyword) &&
          query.toLowerCase().includes(keyword))
      ),
  )

export const youtubePlatformDownloadApi: PlatformDownloadApi = async track => {
  const searchTerm = [getArtistsString(track.artists), track.title].join('–')

  const url = new URL('https://youtube.com/results')
  url.searchParams.set('search_query', searchTerm)

  const { data: text } = await axios.get(url.toString(), {
    headers: YOUTUBE_HEADERS,
  })

  const doc = new jsdom.JSDOM(text)

  if (!doc) {
    throw new Error('Failed to parse HTML')
  }

  const scripts = Array.from(doc.window.document.querySelectorAll('script'))

  const ytInitialDataScript = scripts.find(script =>
    script.textContent?.includes('ytInitialData'),
  )

  if (!ytInitialDataScript) {
    throw new Error('Failed to find ytInitialData script')
  }

  const ytInitialData = ytInitialDataScript.textContent?.match(
    /ytInitialData\s*=\s*(.*);/,
  )?.[1]

  if (!ytInitialData) {
    throw new Error('Failed to find ytInitialData')
  }

  const ytInitialDataJson = JSON.parse(ytInitialData)

  const videos =
    ytInitialDataJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
      .map((content: any) => {
        const videoRenderer = content.videoRenderer

        if (!videoRenderer) {
          return null
        }

        const videoId = videoRenderer.videoId as string
        const title = videoRenderer.title.runs[0].text as string
        const duration =
          (videoRenderer.lengthText?.simpleText as string)
            .split(':')
            .reduce((acc, v, i, a) => {
              return acc + parseInt(v) * Math.pow(60, a.length - i - 1)
            }, 0) * 1000 // 0:30 / 2:55 / 1:45:33

        if (duration > MAX_VIDEO_DURATION_MS) return null

        const deviationSec = Math.abs(duration - (track.durationMs ?? 0))

        if (deviationSec > MAX_VIDEO_DURATION_DEVIATION_MS) return null

        const viewCount = parseInt(
          (videoRenderer.viewCountText?.simpleText as string)
            .match(/((\d\s*)+)/)?.[0]
            ?.replaceAll(/\s/g, '') ?? '0',
        )

        if (!isValidVideoTitle(title, searchTerm)) {
          return null
        }

        return {
          videoId,
          title,
          duration,
          viewCount,
        }
      })
      .filter(Boolean) as {
      videoId: string
      title: string
      duration: number
      viewCount: number
    }[]

  const video = videos.at(0)

  if (!video) {
    return null
  }

  const stream = await ytdl(video.videoId, {
    quality: 'highestaudio',
    filter: 'audioonly',
    highWaterMark: 1 << 25,
  })

  return {
    stream,
    format: 'WEBM',
    durationMs: video.duration,
  }
}
