<script setup lang="ts">
  import { useVModel } from '@vueuse/core'
  import { nextTick, ref, watch } from 'vue'

  const props = defineProps<{
    closeOnClickOutside?: boolean
    modelValue?: boolean
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
  }>()

  const isOpen = useVModel(props, 'modelValue', emit)

  const dialogRef = ref<HTMLDialogElement>()

  watch(
    isOpen,
    isOpen => {
      nextTick(() => {
        if (isOpen) dialogRef.value?.showModal()
        else dialogRef.value?.close()
      })
    },
    {
      immediate: true,
    },
  )
</script>

<template>
  <dialog ref="dialogRef" class="modal modal-bottom">
    <form
      method="dialog"
      class="modal-box bg-opacity-10 backdrop-blur-md"
      @submit.prevent="isOpen = false"
    >
      <slot />
    </form>

    <form
      v-if="closeOnClickOutside"
      method="dialog"
      class="modal-backdrop"
      @submit.prevent="isOpen = false"
    >
      <button>close</button>
    </form>
  </dialog>
</template>
