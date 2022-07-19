<script setup lang="ts">
import { Game } from '~~/game';

const gameCanvas = ref<HTMLCanvasElement>();
const debugCanvas = ref<HTMLCanvasElement>();
const game = ref();
const debugMode = ref(false);

provide('game', game);
provide('debugMode', debugMode);

onMounted(() => {
  // Create the game
  try {
    game.value = new Game(
      gameCanvas.value as HTMLCanvasElement,
      debugCanvas.value as HTMLCanvasElement
    );
  } catch (error) {
    throw new Error(error as string);
  }
});
</script>

<template>
  <section class="container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <canvas
      ref="debugCanvas"
      :class="['debug-canvas', { visible: debugMode }]"
    />
    <GameTransition />
    <FPSVisualizer v-if="debugMode" />
    <LoadingScreen />
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
</style>
