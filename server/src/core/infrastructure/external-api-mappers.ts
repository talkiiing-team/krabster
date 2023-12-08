import { IArtist, IArtistCredit, IRecording, IRelease } from 'musicbrainz-api'
import {
  Artist,
  ArtistType,
  Release,
  ReleaseArtist,
  Track,
  TrackArtist,
} from '@sovok/server/core/domain'

export const artistToDomain = (artist: IArtist): Artist => ({
  id: artist.id,
  name: artist.name,
  sortName: artist['sort-name'] ?? artist.name,
  aliases: artist.aliases?.map(alias => alias.name) ?? [],
  type:
    ({
      person: 'Person',
      group: 'Group',
      character: 'Character',
      choir: 'Choir',
      orchestra: 'Orchestra',
      other: 'Other',
    }[artist.type ?? 'other'] as ArtistType) ?? 'Other',
})

export const artistCreditToDomain = (
  artistCredit: IArtistCredit,
): TrackArtist => ({
  joinPhrase: artistCredit.joinphrase,
  artist: artistToDomain(artistCredit.artist),
  name: artistCredit.name,
})

export const releaseArtistCreditToDomain = (
  artistCredit: IArtistCredit,
): ReleaseArtist => ({
  joinPhrase: artistCredit.joinphrase,
  artist: artistToDomain(artistCredit.artist),
  name: artistCredit.name,
})

export const releaseToDomain = (release: IRelease): Release => ({
  id: release.id,
  title: release.title,
  artists: release['artist-credit']?.map(releaseArtistCreditToDomain) ?? [],
  releaseDate: release.date ? new Date(release.date) : null,
  coverId: release['cover-art-archive']?.front ? release.id : null,
  status:
    ({
      Official: 'Official',
      Promotion: 'Promotion',
      Bootleg: 'Bootleg',
      PseudoRelease: 'PseudoRelease',
      Withdrawn: 'Withdrawn',
      Cancelled: 'Cancelled',
    }[release.status] as Release['status']) ?? 'Unknown',
})

export const recordingToDomain = (recording: IRecording): Track => ({
  id: recording.id,
  title: recording.title,
  artists: recording['artist-credit']?.map(artistCreditToDomain) ?? [],
  durationMs: recording.length !== null ? recording.length : null,
  releases:
    recording.releases?.map(releaseToDomain).map(release => ({
      release,
      position: 0,
    })) ?? [],
})
