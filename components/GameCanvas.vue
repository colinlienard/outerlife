<script setup lang="ts">
import { Game } from '~~/game';
// import FPSVisualizer from './FPSVisualizer.vue';
// import LoadingScreen from './LoadingScreen.vue';
// import PauseScreen from './menus/PauseScreen.vue';

const gameCanvas = ref<HTMLCanvasElement>();
// const debugCanvas = ref<HTMLCanvasElement>();
const game = ref();
// const debugMode = ref(false);

provide('game', game);
// provide('debugMode', debugMode);

onMounted(() => {
  const context = (gameCanvas.value as HTMLCanvasElement).getContext('webgl2');
  game.value = new Game(context as WebGL2RenderingContext);
});
</script>

<template>
  <section class="container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <!-- <canvas
      ref="debugCanvas"
      :class="['debug-canvas', { visible: debugMode }]"
    /> -->
    <!-- <FPSVisualizer v-if="debugMode" />
    <LoadingScreen />
    <PauseScreen /> -->
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
</style>
