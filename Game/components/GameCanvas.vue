<script setup lang="ts">
import Game from '../Game';
import PauseScreen from './Menus/PauseScreen.vue';
import FPSVisualizer from './FPSVisualizer.vue';
import { TRANSITION_DURATION } from '../globals';

const terrainCanvas = ref<HTMLCanvasElement>();
const environmentCanvas = ref<HTMLCanvasElement>();
const game = ref();
const showTransition = ref(false);
const showFPS = ref(false);
const transitionDuration = `${TRANSITION_DURATION}ms`;

provide('game', game);
provide('showFPS', showFPS);

const endTransition = () => {
  showTransition.value = false;
  window.removeEventListener('scene-switch', endTransition);
};

const performTransition = () => {
  showTransition.value = true;
  window.addEventListener('scene-switch', endTransition);
};

onMounted(() => {
  if (terrainCanvas.value && environmentCanvas.value) {
    game.value = new Game(terrainCanvas.value, environmentCanvas.value);
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
    <canvas ref="terrainCanvas" class="terrain-canvas" moz-opaque />
    <canvas ref="environmentCanvas" class="environment-canvas" />
    <FPSVisualizer v-if="showFPS" />
    <Transition name="transition">
      <div v-if="showTransition" class="transition" />
    </Transition>
    <PauseScreen />
  </section>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100vw;
  height: 100vh;

  .environment-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
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
