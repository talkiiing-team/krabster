<script setup lang="ts">
  import { type Component } from 'vue'
  import UiButton from '../ui/ui-button.vue'

  defineProps<{
    icon: Component
  }>()
</script>

<template>
  <UiButton class="btn-ghost btn-circle text-white/50">
    <component class="h-6 w-6" :is="icon" />
  </UiButton>
</template>
