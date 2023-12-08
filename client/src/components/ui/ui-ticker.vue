<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'
  import { useResizeObserver } from '@vueuse/core'

  const ANIMATION_DURATION = 30

  const props = defineProps<{
    text: string
  }>()

  const rootRef = ref<HTMLDivElement>()
  const innerRef = ref<HTMLSpanElement>()
  const isOverflowing = ref(true)
  const duration = ref(0)

  const update = () => {
    const rootWidth = rootRef.value?.getBoundingClientRect().width ?? 0
    const innerRawWidth = innerRef.value?.getBoundingClientRect().width ?? 0
    const innerWidth = innerRawWidth / (isOverflowing.value ? 2 : 1)

    isOverflowing.value = innerWidth > rootWidth
    duration.value = innerWidth * ANIMATION_DURATION
  }

  watch(
    () => props.text,
    () => {
      nextTick(update)
    },
  )
  useResizeObserver(rootRef, update)
  onMounted(update)
</script>

<template>
  <div
    ref="rootRef"
    class="overflow-hidden"
    :class="isOverflowing && 'fade-right-8'"
  >
    <span
      ref="innerRef"
      class="inline-block whitespace-nowrap"
      :class="isOverflowing && $style.overflowingText"
      :style="{
        '--ui-overflowing-text-duration': `${duration}ms`,
      }"
      :data-overflowing-text="text"
      v-text="text"
    />
  </div>
</template>

<style module>
  @keyframes scroll-right {
    0% {
      transform: translateX(0);
    }
    80%,
    100% {
      transform: translateX(calc(-50% - var(--ui-overflowing-text-margin) / 2));
    }
  }

  .overflowingText {
    --ui-overflowing-text-margin: 1rem;

    animation: scroll-right var(--ui-overflowing-text-duration) linear 3s
      infinite;
  }

  .overflowingText::after {
    margin-left: var(--ui-overflowing-text-margin);
    content: attr(data-overflowing-text);
  }
</style>
