<script setup lang="ts">
  import HeroiconsMusicalNote from '~icons/heroicons/musical-note'
  import UiImage from '@sovok/client/components/ui/ui-image.vue'
  import { computed, ref } from 'vue'
  import { ImageInfo } from '@sovok/client/domain/image.ts'

  const props = defineProps<{
    releaseId?: string
    size?: number
  }>()

  const isImageHidden = ref(true)

  const COVER_URL_BASE = 'https://coverartarchive.org/release/'

  const getCoverUrl = (id: string) => {
    return `${COVER_URL_BASE}${id}/front-${props.size ?? 250}`
  }

  const releaseAvatar = computed<ImageInfo | null>(() => {
    const releaseId = props.releaseId

    if (!releaseId) return null

    return {
      width: props.size ?? 250,
      height: props.size ?? 250,
      aspectRatio: 1,
      url: getCoverUrl(releaseId),
    }
  })
</script>

<template>
  <div
    class="avatar"
    :class="(!releaseAvatar || isImageHidden) && 'placeholder'"
  >
    <div
      v-show="!releaseAvatar || isImageHidden"
      class="bg-primary-content text-primary w-full rounded"
    >
      <HeroiconsMusicalNote width="24" height="24" />
    </div>

    <UiImage
      v-if="releaseAvatar"
      v-show="!isImageHidden"
      class="h-full w-full rounded"
      :image="releaseAvatar"
      @load="() => (isImageHidden = false)"
      @error="() => (isImageHidden = true)"
    />
  </div>
</template>
