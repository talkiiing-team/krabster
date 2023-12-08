<script lang="ts" setup>
  import { ImageInfo } from '@sovok/client/domain/image'
  import { computed } from 'vue'

  const { image } = defineProps<{
    image: ImageInfo
  }>()

  const emit = defineEmits<{
    (event: 'load'): void
    (event: 'error'): void
  }>()

  const aspectRatio = computed(
    () => image.aspectRatio ?? image.width / image.height,
  )

  const defaultSrc = computed(() => image.url)
</script>

<template>
  <picture>
    <img
      :src="defaultSrc"
      :width="image.width"
      :height="image.height"
      :loading="image.loading ?? 'eager'"
      :alt="image.alt ?? ''"
      draggable="false"
      v-bind="$attrs"
      @load="emit('load')"
      @error="emit('error')"
      :style="{
        aspectRatio,
      }"
    />
  </picture>
</template>
