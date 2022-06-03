<script setup lang="ts">
import Game from '../Game';
import { TRANSITION_DURATION } from '../globals';
import PauseMenu from './PauseMenu.vue';

const canvas = ref<HTMLCanvasElement>();
const game = ref();
const showTransition = ref(false);
const transitionDuration = `${TRANSITION_DURATION}ms`;

provide('game', game);

const endTransition = () => {
  showTransition.value = false;
  window.removeEventListener('scene-switch', endTransition);
};

const performTransition = () => {
  showTransition.value = true;
  window.addEventListener('scene-switch', endTransition);
};

onMounted(() => {
  if (canvas.value) {
    game.value = new Game(canvas.value);
  }

  window.addEventListener('transition', performTransition);
});

onUnmounted(() => {
  game.value.destructor();

  window.removeEventListener('transition', performTransition);
});
</script>

<template>
  <section class="container">
    <canvas ref="canvas" class="canvas" />
    <Transition name="transition">
      <div v-if="showTransition" class="transition" />
    </Transition>
    <PauseMenu />
  </section>
</template>

<style scoped lang="scss">
.container {
  position: relative;
}

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
