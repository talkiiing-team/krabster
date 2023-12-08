import { Download } from '@sovok/server/core/domain'
import { GetDownload, InsertDownload } from '@sovok/server/core/application'
import {
  PrismaInjection,
  isUniqueConstraintError,
} from '@sovok/server/shared/prisma'

import * as Prisma from '@prisma/client'

type DownloadDao = Prisma.Download & {
  track: Prisma.Track & {
    artists: (Prisma.TrackArtist & {
      artist: Prisma.Artist
    })[]
    releases: (Prisma.TrackRelease & {
      release: Prisma.Release & {
        artists: (Prisma.ReleaseArtist & {
          artist: Prisma.Artist
        })[]
      }
    })[]
  }
}

const daoToDomain = (dao: DownloadDao): Download => ({
  id: dao.id,
  durationMs: dao.durationMs,
  format: dao.format,
  platform: dao.platform,

  track: {
    id: dao.track.id,
    title: dao.track.title,
    durationMs: dao.track.durationMs,
    artists: dao.track.artists.map(artist => ({
      name: artist.name,
      joinPhrase: artist.joinPhrase,
      artist: {
        id: artist.artist.id,
        name: artist.name ?? artist.artist.name,
        type: artist.artist.type,
        sortName: artist.artist.sortName,
        aliases: artist.artist.aliases,
      },
    })),
    releases: dao.track.releases.map(release => ({
      position: release.position,
      release: {
        id: release.release.id,
        title: release.release.title,
        artists: release.release.artists.map(artist => ({
          name: artist.name,
          joinPhrase: artist.joinPhrase,
          artist: {
            id: artist.artist.id,
            name: artist.name ?? artist.artist.name,
            type: artist.artist.type,
            sortName: artist.artist.sortName,
            aliases: artist.artist.aliases,
          },
        })),
        releaseDate: release.release.releaseDate,
        coverId: release.release.coverId,
        status: release.release.status,
      },
    })),
  },
})

type DownloadsRepositoryDeps = PrismaInjection

export const getDownload =
  ({ prisma }: DownloadsRepositoryDeps): GetDownload =>
  async ({ trackId, platform }) => {
    const download = await prisma.download.findFirst({
      include: {
        track: {
          include: {
            artists: {
              include: {
                artist: true,
              },
              orderBy: {
                order: 'asc',
              }
            },
            releases: {
              include: {
                release: {
                  include: {
                    artists: {
                      include: {
                        artist: true,
                      },
                      orderBy: {
                        order: 'asc',
                      }
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        trackId,
        platform,
      },
    })

    if (!download) {
      return null
    }

    return daoToDomain(download)
  }

export const insertDownload =
  ({ prisma }: DownloadsRepositoryDeps): InsertDownload =>
  async download => {
    try {
      await prisma.$transaction(async prisma => {
        await prisma.artist.createMany({
          data: [
            download.track.artists,
            download.track.releases.flatMap(release => release.release.artists),
          ]
            .flat()
            .map(artist => ({
              id: artist.artist.id,
              name: artist.artist.name,
              type: artist.artist.type,
              sortName: artist.artist.sortName,
              aliases: artist.artist.aliases,
            })),

          skipDuplicates: true,
        })

        await prisma.release.createMany({
          data: download.track.releases.map(release => ({
            id: release.release.id,
            title: release.release.title,
            releaseDate: release.release.releaseDate,
            coverId: release.release.coverId,
            status: release.release.status,
          })),

          skipDuplicates: true,
        })

        await prisma.releaseArtist.createMany({
          data: download.track.releases.flatMap(release =>
            release.release.artists.map((artist, order) => ({
              name: artist.name,
              joinPhrase: artist.joinPhrase,
              artistId: artist.artist.id,
              releaseId: release.release.id,
              order,
            })),
          ),
        })

        await prisma.track.create({
          data: {
            id: download.track.id,
            title: download.track.title,
            durationMs: download.track.durationMs,

            artists: {
              create: download.track.artists.map((artist, order) => ({
                name: artist.name,
                joinPhrase: artist.joinPhrase,
                order,

                artist: {
                  connect: {
                    id: artist.artist.id,
                  },
                },
              })),
            },

            releases: {
              create: download.track.releases.map(release => ({
                position: release.position,

                release: {
                  connect: {
                    id: release.release.id,
                  },
                },
              })),
            },
          },
        })

        await prisma.download.create({
          data: {
            id: download.id,
            durationMs: download.durationMs,
            format: download.format,
            platform: download.platform,
            track: {
              connect: {
                id: download.track.id,
              },
            },
          },
        })
      })
    } catch (e) {
      if (isUniqueConstraintError(e)) {
        return
      }

      throw e
    }
  }
