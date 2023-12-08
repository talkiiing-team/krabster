<script setup lang="ts">
  import PlayerControlButton from './player-control-button.vue'

  import PlayIcon from '~icons/heroicons/play-solid'
  import PauseIcon from '~icons/heroicons/pause-solid'
  import BackwardIcon from '~icons/heroicons/backward-solid'
  import ForwardIcon from '~icons/heroicons/forward-solid'
  import UiButton from '../ui/ui-button.vue'

  defineProps<{
    hasTrack: boolean
    isPlaying: boolean
  }>()

  const emit = defineEmits<{
    (event: 'play' | 'pause' | 'next' | 'previous'): void
  }>()

  const PLAY_BTN_CLASSNAMES = 'w-6 h-6'
</script>

<template>
  <div class="flex w-full items-center justify-center space-x-2">
    <PlayerControlButton :icon="BackwardIcon" @click="emit('previous')" />

    <UiButton
      :class="[
        'btn-circle',
        'btn-outline',
        !isPlaying && !hasTrack && 'disabled',
      ]"
      @click="emit(isPlaying ? 'pause' : 'play')"
    >
      <PauseIcon v-if="isPlaying" :class="PLAY_BTN_CLASSNAMES" />
      <PlayIcon v-else :class="[PLAY_BTN_CLASSNAMES, 'translate-x-1px']" />
    </UiButton>

    <PlayerControlButton :icon="ForwardIcon" @click="emit('next')" />
  </div>
</template>
