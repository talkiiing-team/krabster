import { defineStore } from 'pinia'
import { isAndroid } from './device-info'
import { PlayerSettings } from '../domain/settings'
import { useLocalStorage } from '@vueuse/core'

const LOCAL_STORAGE_KEY = 'sovok-player-settings'

const getDefaultSettings = (): PlayerSettings => ({
  animation: !isAndroid(),
})

export const useSettingsStore = defineStore('settings', () => {
  const settings = useLocalStorage<PlayerSettings>(
    LOCAL_STORAGE_KEY,
    getDefaultSettings,
  )

  return {
    settings,
  }
})
