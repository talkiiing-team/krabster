<script setup lang="ts">
  import { ComponentPublicInstance, ref } from 'vue'
  import UiInput from '@sovok/client/components/ui/ui-input.vue'
  import UiSpinner from '@sovok/client/components/ui/ui-spinner.vue'
  import UiTrackCard from '@sovok/client/components/ui/ui-track-card.vue'
  import BaseTypography from '@sovok/client/components/base-typography.vue'
  import { useSearch } from '@sovok/client/composables/search'
  import { useTrackMenu } from '@sovok/client/composables/track-menu'
  import { useIsMobile } from '@sovok/client/composables/device-info'
  import { usePlayerStore } from '@sovok/client/composables/player'

  const isMobile = useIsMobile()

  const searchInput = ref<ComponentPublicInstance<typeof UiInput>>()

  const {
    searchTerm,
    data,
    isFirstSearch,
    isValidating,
    fetchImmediately: _fetchImmediately,
  } = useSearch()

  const fetchImmediately = () => {
    _fetchImmediately()

    if (isMobile.value) {
      searchInput.value?.$el.blur()
    }
  }

  const { openTrackMenu } = useTrackMenu()

  const playerStore = usePlayerStore()

  async function externalPlay(trackId: string) {
    playerStore.toggleFullscreenPlayer()
    await playerStore.play(trackId)
  }
</script>

<template>
  <div class="relative flex w-full flex-col space-y-6">
    <form class="w-full" @submit.prevent="fetchImmediately">
      <UiInput
        v-model="searchTerm"
        ref="searchInput"
        class="input-secondary w-full"
        placeholder="Search for tracks"
        type="text"
        inputmode="search"
        autofocus
      />
    </form>

    <BaseTypography v-if="isFirstSearch" class="text-center">
      <p class="balance">
        Start typing to search for tracks. You can search by track name, artist
        name or album name.
      </p>
    </BaseTypography>

    <div v-else-if="isValidating" class="mx-auto">
      <UiSpinner />
    </div>

    <BaseTypography v-else-if="data?.length === 0" class="text-center">
      <p class="balance">
        No tracks found. Try to search for something else or check your
        spelling.
      </p>
    </BaseTypography>

    <div v-else class="flex flex-col space-y-2">
      <UiTrackCard
        v-for="track in data"
        :key="track.id"
        :track="track"
        @open-context-menu="openTrackMenu(track)"
        @click="externalPlay(track.id)"
      />
    </div>
  </div>
</template>
