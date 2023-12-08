import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Menu } from '../domain/menu'

export const useMenuStore = defineStore('menu', () => {
  const menusStack = ref<Menu[]>([])

  const currentMenu = computed(() => menusStack.value.at(-1))

  const openMenu = (menu: Menu) => menusStack.value.push(menu)
  const goBack = () => menusStack.value.pop()
  const closeMenu = () => (menusStack.value = [])

  return {
    menusStack,
    currentMenu,
    openMenu,
    goBack,
    closeMenu,
  }
})
