<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { secondsFormat } from '@sovok/client/utils/seconds-format.ts'
  import { useEventListener } from '@vueuse/core'

  const props = defineProps<{
    durationSec: number
    progressPart: number
    bufferedPart: number
    playing: boolean
  }>()

  const emit = defineEmits<{
    (event: 'seek', value: number): void
  }>()

  const trackRef = ref<HTMLDivElement>()

  const msLeft = ref(0)
  const width = ref(0)

  const reset = (value: number) => {
    msLeft.value = Math.floor((props.durationSec - value) * 1000)
    width.value = (value * 100) / props.durationSec
  }

  const valueSec = computed(() => {
    const value = props.durationSec * props.progressPart
    return Math.floor(value * 1000) / 1000
  })

  watch(
    () => [props.playing, props.durationSec, props.progressPart],
    () => {
      reset(valueSec.value)
    },
    { immediate: true },
  )

  watch(
    () => [width.value, props.playing],
    ([_width, playing], _, invalidate) => {
      if (_width !== 100 && playing) {
        const timeout = setTimeout(() => {
          width.value = 100
        }, 100)

        invalidate(() => clearTimeout(timeout))
      }
    },
    {
      immediate: true,
    },
  )

  const isMaxValueSet = computed(
    () => props.durationSec !== undefined && props.durationSec > 0,
  )

  const formattedCurrentPosition = computed(() =>
    props.durationSec > 0 ? secondsFormat(valueSec.value) : '-:--',
  )
  const formattedDuration = computed(() =>
    props.durationSec > 0 ? secondsFormat(props.durationSec) : '-:--',
  )

  const endSeek = (e: MouseEvent) => {
    const sliderBounds = trackRef.value?.getBoundingClientRect()

    if (!sliderBounds) return

    let part = (e.clientX - sliderBounds.x) / sliderBounds.width

    if (part < 0.02) part = 0

    const newPosition = Math.floor(props.durationSec * part * 1000) / 1000

    emit('seek', part)

    msLeft.value = Math.floor((props.durationSec - newPosition) * 1000)
    width.value = (newPosition * 100) / props.durationSec
  }

  useEventListener(document, ['visibilitychange', 'focus'], () => {
    if (document.visibilityState === 'visible') {
      reset(valueSec.value)
    }
  })
</script>

<template>
  <div class="flex w-full flex-col text-white/80">
    <div
      class="relative py-2"
      datatype="seekbar"
      ref="trackRef"
      @click="endSeek"
    >
      <div class="relative h-[0.25rem]">
        <div
          class="absolute left-0 top-0 h-[0.25rem] w-full rounded-sm bg-white/10"
        ></div>
        <template v-if="isMaxValueSet">
          <div
            class="absolute left-0 top-0 h-[0.25rem] rounded-sm bg-white/50 transition-[width] duration-100"
            :style="{
              width: `${bufferedPart > 0 ? 100 * bufferedPart : 0}%`,
            }"
          />
          <div
            class="absolute left-0 top-0 h-[0.25rem] rounded-sm bg-white/80"
            ref="progressRef"
            :style="{
              width: `${width}%`,
              transition:
                playing && width === 100 ? `width ${msLeft}ms linear` : 'none',
            }"
          />
        </template>
      </div>
    </div>
    <div class="flex w-full justify-between text-xs">
      <span>{{ formattedCurrentPosition }}</span>
      <span>{{ formattedDuration }}</span>
    </div>
  </div>
</template>
