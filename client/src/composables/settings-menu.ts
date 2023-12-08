import { useMenuStore } from './menu'
import { useSettingsStore } from './settings'

const MENU_TITLE = 'Player settings'

export const usePlayerSettingsMenu = () => {
  const menuStore = useMenuStore()
  const settingsStore = useSettingsStore()

  const openAnimationMenu = () => {
    menuStore.openMenu({
      title: `Animation: ${
        settingsStore.settings.animation ? 'Enabled' : 'Disabled'
      }`,
      groups: [
        [
          {
            title: settingsStore.settings.animation ? 'Disable' : 'Enable',
            action: () => {
              settingsStore.settings.animation =
                !settingsStore.settings.animation
              menuStore.closeMenu()
            },
          },
        ],
      ],
    })
  }

  const openPlayerSettingsMenu = () => {
    menuStore.openMenu({
      title: MENU_TITLE,
      groups: [
        [
          {
            title: `Animation: ${
              settingsStore.settings.animation ? 'Enabled' : 'Disabled'
            }`,
            action: () => openAnimationMenu(),
          },
        ],
      ],
    })
  }

  return {
    openPlayerSettingsMenu,
  }
}
