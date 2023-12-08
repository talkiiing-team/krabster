<script setup lang="ts">
  withDefaults(
    defineProps<{
      large?: boolean
      color?: 'white' | 'primary'
    }>(),
    {
      color: 'primary',
    },
  )
</script>

<template>
  <div
    :class="[
      $style.uiSpinner,
      color === 'primary' ? $style.primary : $style.white,
      $style.animating,
    ]"
  >
    <div v-for="i in 12" :key="i" :class="$style.uiSpinnerBlade" />
  </div>
</template>

<style module>
  .uiSpinner {
    position: relative;
    width: 20px;
    height: 20px;
  }
  .uiSpinner .uiSpinnerBlade {
    position: absolute;
    left: 44.5%;
    top: 37%;
    width: 10%;
    height: 25%;
    border-radius: 50%/20%;
    animation: uiSpinnerFade 1s linear infinite;
    animation-play-state: paused;
  }
  .uiSpinner .uiSpinnerBlade:nth-child(1) {
    animation-delay: -1.66667s;

    transform: rotate(30deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(2) {
    animation-delay: -1.58333s;

    transform: rotate(60deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(3) {
    animation-delay: -1.5s;

    transform: rotate(90deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(4) {
    animation-delay: -1.41667s;

    transform: rotate(120deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(5) {
    animation-delay: -1.33333s;

    transform: rotate(150deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(6) {
    animation-delay: -1.25s;

    transform: rotate(180deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(7) {
    animation-delay: -1.16667s;

    transform: rotate(210deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(8) {
    animation-delay: -1.08333s;

    transform: rotate(240deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(9) {
    animation-delay: -1s;

    transform: rotate(270deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(10) {
    animation-delay: -0.91667s;

    transform: rotate(300deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(11) {
    animation-delay: -0.83333s;

    transform: rotate(330deg) translate(0, -150%);
  }
  .uiSpinner .uiSpinnerBlade:nth-child(12) {
    animation-delay: -0.75s;

    transform: rotate(360deg) translate(0, -150%);
  }
  .uiSpinner.animating .uiSpinnerBlade {
    animation-play-state: running;
  }
  .uiSpinner.white .uiSpinnerBlade {
    background-color: white;
  }
  .uiSpinner.primary .uiSpinnerBlade {
    background-color: theme('colors.primary');
  }
  .uiSpinner.large {
    width: 35px;
    height: 35px;
  }
  .uiSpinner.large .uiSpinnerBlade {
    width: 8.57143%;
    height: 25.71429%;
    border-radius: 50%/16.67%;
  }

  @keyframes uiSpinnerFade {
    0% {
      opacity: 0.85;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 0.25;
    }
  }
</style>
