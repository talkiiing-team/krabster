<script setup lang="ts">
  import { computed, ref } from 'vue'
  import HeroiconsEllipsisVertical from '~icons/heroicons/ellipsis-vertical'
  import { Track, getArtistsString, getPriorityRelease } from '@sovok/shared'
  import UiButton from './ui-button.vue'
  import UiCover from '@sovok/client/components/ui/ui-cover.vue'

  const rootRef = ref<HTMLElement>()

  const { track } = defineProps<{
    track: Track
  }>()

  const emit = defineEmits<{
    (event: 'openContextMenu'): void
    (event: 'click', value: MouseEvent): void
  }>()

  const toggleContextMenu = () => emit('openContextMenu')

  const displayRelease = computed(() => getPriorityRelease(track))

  const artistsText = computed(() => getArtistsString(track.artists))

  const releaseText = computed(() => displayRelease.value?.title)
</script>

<template>
  <div class="flex cursor-pointer select-none flex-row" ref="rootRef">
    <UiCover
      class="w-16 flex-shrink-0"
      :release-id="displayRelease?.id"
      @click="emit('click', $event)"
    />

    <div
      class="ml-3 mr-auto flex max-w-full flex-grow select-none flex-col justify-center overflow-hidden"
      @click="emit('click', $event)"
    >
      <span class="font-headings truncate font-bold" v-text="track.title" />
      <div class="truncate text-sm">
        <span v-text="artistsText" />
        <span class="ml-2 inline opacity-50" v-text="releaseText" />
      </div>
    </div>

    <UiButton
      class="btn-circle btn-sm btn-ghost self-center"
      @click="toggleContextMenu"
    >
      <HeroiconsEllipsisVertical width="24" height="24" />
    </UiButton>
  </div>
</template>
