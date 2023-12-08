<script setup lang="ts">
  import BaseTypography from '@sovok/client/components/base-typography.vue'
  import errorGif from '@sovok/client/assets/error.gif'
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <BaseTypography class="w-full text-center">
      <span>(⇀‸↼‶)</span>

      <h1>Not found</h1>

      <p>
        The page you are looking for does not exist. You may have mistyped the
        address or the page may have moved.
      </p>

      <img class="mx-auto" :src="errorGif" />

      <RouterLink to="/"> Go to the home page </RouterLink>
    </BaseTypography>
  </div>
</template>
