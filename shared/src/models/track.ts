import { z } from 'zod'

export const ReleaseStatus = z.enum([
  'Official',
  'Promotion',
  'Bootleg',
  'PseudoRelease',
  'Withdrawn',
  'Cancelled',
  'Unknown',
])

export type ReleaseStatus = z.infer<typeof ReleaseStatus>

export const ArtistType = z.enum([
  'Person',
  'Group',
  'Character',
  'Choir',
  'Orchestra',
  'Other',
])

export type ArtistType = z.infer<typeof ArtistType>

export const Artist = z.object({
  id: z.string().describe('MusicBrainz ID'),
  name: z.string().describe('Name used for display'),
  sortName: z.string().describe('Name used for sorting'),
  aliases: z.array(z.string()).describe('Aliases of the artist (if any)'),
  type: ArtistType.describe('Type of artist'),
})

export type Artist = z.infer<typeof Artist>

export const TrackArtist = z.object({
  joinPhrase: z.string().nullable().default(null).describe('Join phrase'),
  artist: Artist.describe('Artist'),
  name: z.string().nullable().describe('Name used for display'),
})

export type TrackArtist = z.infer<typeof TrackArtist>

export const ReleaseArtist = z.object({
  joinPhrase: z.string().nullable().default(null).describe('Join phrase'),
  artist: Artist.describe('Artist'),
  name: z.string().nullable().describe('Name used for display'),
})

export type ReleaseArtist = z.infer<typeof ReleaseArtist>

export const Release = z.object({
  id: z.string().describe('MusicBrainz ID'),
  title: z.string().describe('Title'),
  artists: z.array(ReleaseArtist).describe('Artists'),
  releaseDate: z.union([
    z.date().nullable().default(null).describe('Release date'),
    z.string(),
  ]),
  coverId: z.string().nullable().describe('Cover ID'),
  status: ReleaseStatus.describe('Release status'),
})

export type Release = z.infer<typeof Release>

export const TrackRelease = z.object({
  release: Release.describe('Release'),
  position: z.number().describe('Position on release'),
})

export type TrackRelease = z.infer<typeof TrackRelease>

export const Track = z.object({
  id: z.string().describe('MusicBrainz ID'),
  title: z.string().describe('Title'),
  artists: z.array(TrackArtist).describe('Artists'),
  releases: z.array(TrackRelease).describe('Releases'),
  durationMs: z
    .number()
    .nullable()
    .default(null)
    .describe('Duration in milliseconds'),
})

export type Track = z.infer<typeof Track>

export const getArtistsString = (artists: TrackArtist[]): string =>
  artists.reduce(
    (acc, current) =>
      acc + (current.name ?? current.artist.name) + (current.joinPhrase ?? ''),
    '',
  )

export const getReleaseShortInfoString = (release: Release): string =>
  `${release.title} – Release by ${getArtistsString(
    release.artists,
  )} – Listen on node-universal-music`

export const getTrackShortInfoString = (track: Track): string =>
  `${track.title} — ${getArtistsString(
    track.artists,
  )} — Listen on node-universal-music`

export const getPriorityRelease = (track: Track): Release | null =>
  track.releases.find(release => release.release.status === 'Official')
    ?.release ??
  track.releases.at(0)?.release ??
  null

export const getReleaseCoverUrl = (
  release: Release,
  size: number = 250,
): string => {
  if (!release.id) {
    return ''
  }

  return `https://coverartarchive.org/release/${release.id}/front-${size}.jpg`
}
