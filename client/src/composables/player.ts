import { defineStore } from 'pinia'
import {
  PlayState,
  usePlayerService,
} from '@sovok/client/domain/player-service.ts'
import { Download, ServerInfo } from '@sovok/shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '../trpc'
import { useToggle } from '@vueuse/core'

export const usePlayerStore = defineStore('player', () => {
  const service = usePlayerService()

  const router = useRouter()

  const currentDownload = ref<Download | null>(null)
  const currentServer = ref<ServerInfo | null>(null)

  const state = ref<Partial<PlayState>>({})

  const isPlaying = ref(false)

  const [isShowFullscreenPlayer, toggleFullscreenPlayer] = useToggle(false)

  service.emitter.on('resume', () => (isPlaying.value = true))
  service.emitter.on('pause', () => (isPlaying.value = false))
  service.emitter.on('end', () => {
    isPlaying.value = false
    currentDownload.value = null
    state.value = {}
    toggleFullscreenPlayer(false)
  })
  service.emitter.on('error', () => (isPlaying.value = false))

  service.emitter.on('progress', ({ durationMs, progress, buffered }) => {
    if (progress) {
      state.value.progress = progress
    }

    if (durationMs) {
      state.value.durationMs = durationMs
    }

    if (buffered) {
      state.value.buffered = buffered
    }
  })

  service.emitter.on('buffering', buffered => {
    state.value.buffered = buffered
  })

  const play = async (trackId: string) => {
    if (currentDownload.value?.track.id === trackId) return

    currentDownload.value = null
    state.value = {}
    isPlaying.value = false

    service.pause()

    const result = await trpc.music.play.mutate({
      trackId,
      platform: 'YouTube',
    })

    if (result.type === 'error') {
      await router.back()
      // TODO: notification
      return
    }

    currentDownload.value = result.download
    currentServer.value = result.serverInfo

    const newState = service.setSrc(result.serverInfo, result.download)
    setState(newState)

    await service.resume()
  }

  const setState = (newState: Partial<PlayState>) => {
    state.value = newState
  }

  const pause = () => {
    isPlaying.value = false
    service.pause()
  }

  const resume = () => {
    isPlaying.value = true
    service.resume()
  }

  const seek = (progress: number) => {
    service.seek(progress)
    state.value.progress = progress
  }

  return {
    play,
    pause,
    resume,
    seek,
    isPlaying,
    currentDownload,
    state,
    setState,
    isShowFullscreenPlayer,
    toggleFullscreenPlayer,
  }
})
