import {
  Release,
  Track,
  getArtistsString,
  getPriorityRelease,
} from '@sovok/shared'
import { MenuGroup } from '../domain/menu'
import { useMenuStore } from './menu'

export const useTrackMenu = () => {
  const menuStore = useMenuStore()

  const openAllReleasesMenu = (releases: Release[]) => {
    menuStore.openMenu([
      releases.map(release => {
        const artistsTitle = getArtistsString(release.artists)

        return {
          title: `${release.title} ${artistsTitle ? `(${artistsTitle})` : ''}`,
        }
      }),
    ])
  }

  const openTrackMenu = (track: Track) => {
    const priorityRelease = getPriorityRelease(track)

    const items: MenuGroup = [
      {
        title: track.title,
      },
    ]

    if (priorityRelease)
      items.push({
        title: priorityRelease.title,
      })

    if (track.releases.length > 1)
      items.push({
        title: 'All releases...',
        action: () =>
          openAllReleasesMenu(track.releases.map(release => release.release)),
      })

    items.push(...track.artists.map(({ artist }) => ({ title: artist.name })))

    menuStore.openMenu([items])
  }

  return {
    openTrackMenu,
  }
}
