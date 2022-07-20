<script setup lang="ts">
import { Settings } from '~~/game/settings';

const showTransition = ref(false);
const transitionDuration = `${Settings.transitionDuration}ms`;

const endTransition = () => {
  showTransition.value = false;
  window.removeEventListener('end-scene-switch', endTransition);
};

const performTransition = () => {
  showTransition.value = true;
  window.addEventListener('end-scene-switch', endTransition);
};

onMounted(() => {
  window.addEventListener('start-scene-switch', performTransition);
});

onUnmounted(() => {
  window.removeEventListener('start-scene-switch', performTransition);
});
</script>

<template>
  <Transition name="transition">
    <div v-if="showTransition" class="loading-screen" />
  </Transition>
</template>

<style scoped lang="scss">
.loading-screen {
  position: absolute;
  inset: 0;
  background-color: black;

  &.transition-enter-active,
  &.transition-leave-active {
    transition: opacity v-bind(transitionDuration) ease;
  }

  &.transition-enter-from,
  &.transition-leave-to {
    opacity: 0;
  }
}
</style>
