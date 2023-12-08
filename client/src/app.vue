<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import BaseLayout from '@sovok/client/layouts/base-layout.vue'
  import AppMenu from './components/app-menu.vue'
  import PlayerFullscreen from './components/player/player-fullscreen.vue'
  import { providePlayerService } from './domain/player-service'
  // import { enablePageTransitions } from '@sovok/client/composables/transitions'

  // enablePageTransitions()

  providePlayerService()

  const route = useRoute()

  const layout = computed(() => route.meta.layout ?? BaseLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>

  <AppMenu />
  <PlayerFullscreen />
</template>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  *:focus {
    @apply !outline-none;
  }

  .btn {
    @apply !font-normal;
  }
</style>
