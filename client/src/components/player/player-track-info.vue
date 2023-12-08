<script setup lang="ts">
  import { computed } from 'vue'
  import { getArtistsString, type Track } from '@sovok/shared'
  import UiTicker from '@sovok/client/components/ui/ui-ticker.vue'

  const props = defineProps<{
    track: Track
  }>()

  const artistsString = computed(() => getArtistsString(props.track.artists))

  const titleString = computed(() => props.track.title)
</script>

<template>
  <div class="flex w-full flex-col space-y-0.5">
    <UiTicker
      :text="titleString"
      class="font-headings text-2xl font-bold text-white/80"
    />
    <UiTicker :text="artistsString" class="text-md text-white/70" />
  </div>
</template>
