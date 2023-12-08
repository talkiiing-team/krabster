<script setup lang="ts">
  import { computed, nextTick } from 'vue'
  import { RouterLink } from 'vue-router'
  import { exists } from '@sovok/shared'
  import HeroiconsXIcon from '~icons/heroicons/x-mark'
  import HeroiconsChevronLeftIcon from '~icons/heroicons/chevron-left'

  import { useMenuStore } from '../composables/menu'
  import UiModal from './ui/ui-modal.vue'
  import UiTicker from './ui/ui-ticker.vue'

  const menuStore = useMenuStore()

  const isMenuOpen = computed({
    get: () => exists(menuStore.currentMenu),
    set: value => {
      if (!value) {
        menuStore.closeMenu()
      }
    },
  })

  const isShowBackBtn = computed(() => menuStore.menusStack.length > 1)

  const closeMenu = () => {
    nextTick(() => menuStore.closeMenu())
  }

  const goBack = () => {
    nextTick(() => menuStore.goBack())
  }

  const currentMenuGroups = computed(() => {
    if (!menuStore.currentMenu) return []

    return Array.isArray(menuStore.currentMenu)
      ? menuStore.currentMenu
      : menuStore.currentMenu.groups
  })

  const currentMenuTitle = computed(() => {
    if (!menuStore.currentMenu) return null

    return Array.isArray(menuStore.currentMenu)
      ? ''
      : menuStore.currentMenu.title
  })
</script>

<template>
  <UiModal v-model="isMenuOpen" close-on-click-outside>
    <div class="w-full space-y-3">
      <UiTicker
        v-if="currentMenuTitle"
        :text="currentMenuTitle"
        class="font-headings text-center uppercase text-white/70"
      />

      <div
        v-for="(group, i) in currentMenuGroups"
        :key="i"
        class="btn-group btn-group-vertical space-y-1px w-full transition-[height]"
      >
        <template v-for="(item, j) in group" :key="j">
          <RouterLink
            :key="j"
            v-if="item.to"
            class="btn btn-opaque"
            :to="item.to"
          >
            <UiTicker :text="item.title" />
          </RouterLink>

          <button class="btn btn-opaque" @click.prevent="item.action">
            <UiTicker :text="item.title" />
          </button>
        </template>
      </div>

      <div class="btn-group btn-group-vertical space-y-1px w-full">
        <button
          v-if="isShowBackBtn"
          class="btn btn-opaque"
          @click.prevent="goBack"
        >
          <HeroiconsChevronLeftIcon width="16" height="16" />
          Back
        </button>
        <button class="btn btn-opaque" @click.prevent="closeMenu">
          <HeroiconsXIcon width="16" height="16" />
          Close
        </button>
      </div>
    </div>
  </UiModal>
</template>
