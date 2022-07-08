<script setup lang="ts">
import Game from '../Game';
import PauseScreen from './Menus/PauseScreen.vue';
import FPSVisualizer from './FPSVisualizer.vue';
import { TRANSITION_DURATION } from '../globals';

const gameCanvas = ref<HTMLCanvasElement>();
const debugCanvas = ref<HTMLCanvasElement>();
const game = ref();
const showTransition = ref(false);
const debugMode = ref(false);
const transitionDuration = `${TRANSITION_DURATION}ms`;

provide('game', game);
provide('debugMode', debugMode);

const endTransition = () => {
  showTransition.value = false;
  window.removeEventListener('scene-switch', endTransition);
};

const performTransition = () => {
  showTransition.value = true;
  window.addEventListener('scene-switch', endTransition);
};

onMounted(() => {
  game.value = new Game(
    gameCanvas.value as HTMLCanvasElement,
    debugCanvas.value as HTMLCanvasElement
  );

  window.addEventListener('transition', performTransition);
});

onUnmounted(() => {
  game.value.destructor();

  window.removeEventListener('transition', performTransition);
});
</script>

<template>
  <section class="container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <canvas
      ref="debugCanvas"
      :class="['debug-canvas', { visible: debugMode }]"
    />
    <FPSVisualizer v-if="debugMode" />
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

  .game-canvas {
    width: 100vw;
    height: 100vh;
  }

  .debug-canvas {
    width: 100vw;
    height: 100vh;
    position: absolute;
    inset: 0;
    pointer-events: none;

    &:not(.visible) {
      opacity: 0;
    }
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
