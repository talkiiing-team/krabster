<script setup lang="ts">
  import { useVModel } from '@vueuse/core'
  import { onMounted, ref } from 'vue'

  const root = ref<HTMLInputElement>()

  const props = defineProps<{
    modelValue: string
    autofocus?: boolean
  }>()

  const emit = defineEmits(['update:modelValue'])

  const data = useVModel(props, 'modelValue', emit)

  onMounted(() => {
    if (props.autofocus) {
      root.value?.focus()
    }
  })
</script>

<template>
  <input ref="root" v-model="data" class="input" />
</template>
