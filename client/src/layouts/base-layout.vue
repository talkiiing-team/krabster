<script setup lang="ts">
  import BaseHeader from '@sovok/client/components/base-header.vue'
  import BaseFooter from '@sovok/client/components/base-footer.vue'
</script>

<template>
  <div
    class="bg-base-100 container mx-auto flex min-h-full max-w-md flex-grow flex-col"
  >
    <BaseHeader class="sticky left-0 right-0 top-0 z-10 flex-shrink-0" />

    <main class="flex-grow px-4 pb-32 pt-8">
      <slot />
    </main>

    <BaseFooter />
  </div>
</template>
