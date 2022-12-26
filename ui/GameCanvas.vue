<script setup lang="ts">
import { Game } from '~~/game';
import { Settings } from '~~/game/utils';

const gameCanvas = ref<HTMLCanvasElement>();
const game = ref();
const debugMode = ref(false);

const ratio = ref(1);
const cursorSource = computed(
  () => `url(/images/cursor-${ratio.value}.png), default`
);

provide('game', game);
provide('debugMode', debugMode);

const setRatio = () => {
  ratio.value = Math.round(window.innerHeight / Settings.yPixelsNumber);
};

const createGame = () => {
  try {
    game.value = new Game(gameCanvas.value as HTMLCanvasElement);
    setRatio();
  } catch (error) {
    throw new Error(error as string);
  }
};

onMounted(() => {
  // Ask for permission to play audio
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(createGame)
    .catch(createGame);

  window.addEventListener('resize', setRatio);
});
</script>

<template>
  <section class="container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <GameVignette />
    <GameTransition />
    <FPSVisualizer v-if="debugMode" />
    <LoadingScreen />
    <PauseScreen />
    <GameNoise />
  </section>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: v-bind(cursorSource);

  .game-canvas {
    width: 100vw;
    height: 100vh;
  }
}
</style>
