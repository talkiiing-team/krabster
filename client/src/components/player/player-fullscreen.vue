<script setup lang="ts">
  import { useSwipe, useScrollLock } from '@vueuse/core'
  import { useHead } from '@vueuse/head'
  import {
    computed,
    ref,
    type ComponentPublicInstance,
    onMounted,
    onUnmounted,
    watch,
  } from 'vue'
  import PlayerSeekBar from './player-seek-bar.vue'
  import PlayerControls from './player-controls.vue'
  import PlayerTrackInfo from './player-track-info.vue'
  import PlayerTrackInfoSkeleton from './skeletons/player-track-info-skeleton.vue'
  import {
    getPriorityRelease,
    getReleaseCoverUrl,
    getTrackShortInfoString,
  } from '@sovok/shared'
  import HeroiconsChevronDown from '~icons/heroicons/chevron-down'
  import HeroiconsCog from '~icons/heroicons/cog'
  import UiCover from '@sovok/client/components/ui/ui-cover.vue'
  import UiButton from '@sovok/client/components/ui/ui-button.vue'
  import UiTicker from '@sovok/client/components/ui/ui-ticker.vue'
  import UiImage from '@sovok/client/components/ui/ui-image.vue'
  import { usePlayerStore } from '@sovok/client/composables/player'
  import { usePlayerService } from '@sovok/client/domain/player-service'
  import { type ImageInfo } from '@sovok/client/domain/image'
  import { usePlayerSettingsMenu } from '@sovok/client/composables/settings-menu'
  import { useSettingsStore } from '@sovok/client/composables/settings'

  const playerService = usePlayerService()
  const playerStore = usePlayerStore()

  const settingsStore = useSettingsStore()
  const { openPlayerSettingsMenu } = usePlayerSettingsMenu()

  const rootRef = ref<HTMLElement>()
  const coverRef = ref<ComponentPublicInstance>()
  const bgCoverRef = ref<ComponentPublicInstance>()

  const scrollLock = useScrollLock(document.body, false)

  useHead(
    computed(() => ({
      title: playerStore.currentDownload
        ? getTrackShortInfoString(playerStore.currentDownload.track)
        : 'Node Universal Music',
    })),
  )

  useSwipe(rootRef, {
    onSwipeEnd(_, direction) {
      if (direction === 'down') {
        playerStore.toggleFullscreenPlayer()
      }
    },
  })

  onMounted(() => {
    playerService.emitter.on('resume', resetStyles)
    playerService.emitter.on('pause', resetStyles)

    if (settingsStore.settings.animation)
      playerService.emitter.on('amplitude', onAmplitudeRecieved)
  })

  onUnmounted(() => {
    playerService.emitter.off('resume', resetStyles)
    playerService.emitter.off('pause', resetStyles)
    playerService.emitter.off('amplitude', onAmplitudeRecieved)
  })

  watch(
    () => settingsStore.settings.animation,
    value => {
      if (value) {
        playerService.emitter.on('amplitude', onAmplitudeRecieved)
      } else {
        playerService.emitter.off('amplitude', onAmplitudeRecieved)
        resetStyles()
      }
    },
  )

  const toggleFullscreenPlayer = () => {
    playerStore.toggleFullscreenPlayer()
  }

  const isShowFullscreenPlayer = computed(
    () => playerStore.isShowFullscreenPlayer,
  )

  watch(isShowFullscreenPlayer, value => {
    scrollLock.value = value
  })

  const track = computed(() => playerStore.currentDownload?.track)

  const currentRelease = computed(() =>
    track.value ? getPriorityRelease(track.value) : null,
  )

  const releaseCover = computed<ImageInfo | null>(() =>
    currentRelease.value
      ? {
          width: 250,
          height: 250,
          url: getReleaseCoverUrl(currentRelease.value, 250),
        }
      : null,
  )

  const onAmplitudeRecieved = (value: number) => {
    const upscaledValue = value ** 2 / 300000

    const scale = upscaledValue + 1
    const brightness = upscaledValue * 1.9 + 1

    if (coverRef.value)
      coverRef.value.$el.style.transform = `scale(${scale * 100}%)`

    if (bgCoverRef.value)
      bgCoverRef.value.$el.style.filter = `brightness(${
        brightness * 100
      }%) blur(32px)`
  }

  const resetStyles = () => {
    if (coverRef.value) coverRef.value.$el.style.transform = ''

    if (bgCoverRef.value) bgCoverRef.value.$el.style.filter = 'blur(32px)'
  }
</script>

<template>
  <div
    class="transition-tranform fixed bottom-0 z-30 h-full w-full overflow-hidden bg-black duration-300"
    :class="{
      'translate-y-full': !isShowFullscreenPlayer,
    }"
    ref="rootRef"
  >
    <UiImage
      v-if="releaseCover"
      ref="bgCoverRef"
      :image="releaseCover"
      class="absolute left-1/2 top-1/2 h-full w-full origin-center -translate-x-1/2 -translate-y-1/2 scale-110 object-cover"
    />

    <div
      class="xs:pb-16 xs:pt-8 absolute left-0 top-0 z-10 flex h-full w-full flex-grow flex-col justify-between space-y-4 bg-black/80 px-6 pb-6 pt-4"
    >
      <div class="flex flex-row items-center justify-between space-x-2">
        <UiButton
          class="btn-circle btn-sm btn-ghost flex-shrink-0 text-white/70"
          @click="toggleFullscreenPlayer"
        >
          <HeroiconsChevronDown width="28" height="28" />
        </UiButton>

        <UiTicker
          v-if="currentRelease"
          class="font-headings text-sm uppercase text-white/70"
          :text="`Playing &quot;${currentRelease?.title}&quot;`"
        />

        <UiButton
          class="btn-circle btn-sm btn-ghost flex-shrink-0 text-white/70"
          @click="openPlayerSettingsMenu"
        >
          <HeroiconsCog width="28" height="28" />
        </UiButton>
      </div>

      <div class="flex w-full grow flex-col items-center justify-center">
        <UiCover
          :size="1200"
          class="xs:max-w-full mx-auto w-full max-w-[16rem] shadow-2xl shadow-white/10 transition-transform duration-[25ms] md:max-w-xs"
          :release-id="currentRelease?.id"
          ref="coverRef"
        />
      </div>

      <PlayerTrackInfo
        v-if="playerStore.currentDownload"
        class="mx-auto w-full max-w-sm"
        :track="playerStore.currentDownload.track"
      />
      <PlayerTrackInfoSkeleton class="mx-auto w-full max-w-sm" v-else />

      <PlayerSeekBar
        class="mx-auto w-full max-w-sm"
        :progress-part="playerStore.state.progress ?? 0"
        :duration-sec="(playerStore.state.durationMs ?? 0) / 1000"
        :buffered-part="playerStore.state.buffered ?? 0"
        :playing="playerStore.isPlaying"
        @seek="playerStore.seek($event)"
      />

      <PlayerControls
        :is-playing="playerStore.isPlaying"
        :has-track="playerStore.currentDownload !== null"
        @play="playerStore.resume()"
        @pause="playerStore.pause()"
      />
    </div>
  </div>
</template>
