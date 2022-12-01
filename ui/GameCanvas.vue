<script setup lang="ts">
import { Game } from '~~/game';

const gameCanvas = ref<HTMLCanvasElement>();
const game = ref();
const debugMode = ref(false);

provide('game', game);
provide('debugMode', debugMode);

onMounted(() => {
  // Create the game
  try {
    game.value = new Game(gameCanvas.value as HTMLCanvasElement);
  } catch (error) {
    throw new Error(error as string);
  }
});
</script>

<template>
  <section class="container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <GameVignette />
    <GameNoise />
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
  overflow: hidden;

  .game-canvas {
    width: 100vw;
    height: 100vh;
  }
}
</style>
