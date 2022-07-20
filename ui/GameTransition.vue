<script setup lang="ts">
import { Settings } from '~~/game/settings';
import { Emitter } from '~~/game/utils';

const showTransition = ref(true);
const transitionDuration = `${Settings.transitionDuration}ms`;

onMounted(() => {
  Emitter.on('switch-map', () => {
    showTransition.value = true;
  });

  Emitter.on('scene-loaded', () => {
    showTransition.value = false;
  });
});
</script>

<template>
  <Transition name="transition">
    <div v-if="showTransition" class="transition" />
  </Transition>
</template>

<style scoped lang="scss">
.transition {
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
