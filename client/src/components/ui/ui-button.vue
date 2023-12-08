<script setup lang="ts">
  withDefaults(
    defineProps<{
      tag?: string
    }>(),
    {
      tag: 'button',
    },
  )
</script>

<template>
  <component :is="tag" class="btn">
    <slot />
  </component>
</template>
