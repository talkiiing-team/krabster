import {
  Download,
  exists,
  getArtistsString,
  getDownloadUrl,
  getPriorityRelease,
  getReleaseCoverUrl,
  ServerInfo,
  Track,
} from '@sovok/shared'
import mitt from 'mitt'
import { inject, provide } from 'vue'

export type PlayerEventMap = {
  resume: void
  pause: void
  end: void
  error: void

  buffering: number
  progress: { progress: number; durationMs: number; buffered: number }
  amplitude: number
}

export type PlayState = {
  progress: number
  durationMs: number
  buffered: number
}

export class PlayerService {
  #audio: HTMLAudioElement | null = null
  #analyzer: AnalyserNode | null = null
  #source: MediaElementAudioSourceNode | null = null
  #timeoutId: NodeJS.Timeout | null = null

  public readonly emitter = mitt<PlayerEventMap>()

  constructor() {}

  get analyzer() {
    return this.#analyzer
  }

  setSrc(server: ServerInfo, download: Download): PlayState {
    this.#destroyNavigator()
    this.#disconnectAnalyzer()

    try {
      const audio = new Audio()

      document.body.appendChild(audio)

      audio.addEventListener('ended', () => {
        this.#destroyProgress()
        this.emitter.emit('end')
      })

      audio.addEventListener('pause', () => {
        this.#destroyProgress()
        this.emitter.emit('pause')
      })

      audio.addEventListener('play', () => {
        this.#setupProgress()
        this.emitter.emit('resume')
      })

      audio.addEventListener('error', () => {
        this.#destroyProgress()
        this.emitter.emit('pause')
      })

      const url = getDownloadUrl(server, download)

      let src = url

      if (import.meta.env.DEV) {
        src = `/api/cors/${src}`
        src = `${window.location.origin}${src}`
      }

      console.log(`Loading audio from ${src}`)

      audio.autoplay = true
      audio.preload = 'auto'
      audio.src = src

      audio.load()

      this.#audio = audio
    } catch (e) {
      console.error(e)
    }

    this.#createAnalyzer()
    this.#connectAnalyzer()
    this.#setupNavigator(download.track)

    return {
      progress: 0,
      buffered: 0,
      durationMs: download.durationMs,
    }
  }

  pause() {
    this.#audio?.pause()
  }

  async resume() {
    await this.#audio?.play().then(() => this.#connectAnalyzer())
  }

  seek(progress: number) {
    if (this.#audio) this.#audio.currentTime = this.#audio.duration * progress
  }

  #createAnalyzer() {
    if (!this.#audio) return

    const context = new AudioContext()
    const analyser = context.createAnalyser()
    const source = context.createMediaElementSource(this.#audio)

    source.connect(analyser)
    analyser.connect(context.destination)

    this.#analyzer = analyser
    this.#source = source
  }

  #connectAnalyzer() {
    if (this.#analyzer === null) return

    this.#analyzer.fftSize = 256

    const bufferLength = this.#analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!this.#audio) return

      if (!this.#audio.paused) {
        requestAnimationFrame(draw)
      }
      this.#analyzer?.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength
      this.emitter.emit('amplitude', average)
    }

    draw()
  }

  #disconnectAnalyzer() {
    this.#analyzer?.disconnect()
    this.#source?.disconnect()
  }

  #setupProgress() {
    this.#timeoutId = setInterval(() => {
      if (!this.#audio) return

      const durationMs = this.#audio.duration * 1000

      // not using the 'timeupdate' event because it's not precise to the second
      const progress = this.#audio.currentTime / this.#audio.duration

      const buffered =
        this.#audio.buffered.length > 0
          ? this.#audio.buffered.end(0) / this.#audio.duration
          : 0
      this.emitter.emit('progress', { progress, durationMs, buffered })
    }, 200)
  }

  #destroyProgress() {
    if (this.#timeoutId !== null) clearInterval(this.#timeoutId)
  }

  #setupNavigator(track: Track) {
    const priorityRelease = getPriorityRelease(track)
    const artwork = priorityRelease ? getReleaseCoverUrl(priorityRelease) : null
    const artistsString = getArtistsString(track.artists)

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: artistsString,
        artwork: artwork
          ? [
              {
                src: artwork,
                sizes: '250x250',
                type: 'image/jpeg',
              },
            ]
          : [],
      })

      navigator.mediaSession.setActionHandler('play', () => {
        this.resume()
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause()
      })

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (this.#audio) {
          this.#audio.currentTime -= 10
        }
      })

      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (this.#audio) {
          this.#audio.currentTime += 10
        }
      })

      navigator.mediaSession.setActionHandler('seekto', details => {
        if (this.#audio && exists(details.seekTime)) {
          this.#audio.currentTime = details.seekTime
        }
      })

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        // TODO
      })

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        // TODO
      })
    }
  }

  #destroyNavigator() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null

      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('seekbackward', null)
      navigator.mediaSession.setActionHandler('seekforward', null)
      navigator.mediaSession.setActionHandler('seekto', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
    }
  }
}

export const PLAYER_SERVICE_SYMBOL = Symbol('playerService')

export const providePlayerService = () => {
  provide(PLAYER_SERVICE_SYMBOL, new PlayerService())
}

export const usePlayerService = () => {
  const service = inject(PLAYER_SERVICE_SYMBOL) as PlayerService

  if (!service) {
    throw new Error('usePlayerService() is called without provider.')
  }

  return service
}
