<script setup lang="ts">
  import HeroiconsMagnifyingGlass from '~icons/heroicons/magnifying-glass'
  import HeroiconsHome from '~icons/heroicons/home'
  import { Page } from '@sovok/client/domain/page'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'

  const route = useRoute()

  const isSearchPage = computed(() => route.name === Page.Search)

  const link = computed(() => ({
    name: isSearchPage.value ? Page.Home : Page.Search,
  }))

  const icon = computed(() =>
    isSearchPage.value ? HeroiconsHome : HeroiconsMagnifyingGlass,
  )
</script>

<template>
  <header
    class="bg-base-100/50 border-b-base-200 flex h-16 w-full select-none items-center justify-between px-4 shadow backdrop-blur-md"
  >
    <RouterLink class="text-primary font-headings text-2xl font-bold" to="/">
      universal-music-platform
    </RouterLink>

    <RouterLink class="btn btn-circle btn-ghost text-primary" :to="link">
      <component :is="icon" width="24" height="24" />
    </RouterLink>
  </header>
</template>
