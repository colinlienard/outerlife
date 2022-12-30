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
  <section class="game-container">
    <canvas ref="gameCanvas" class="game-canvas" />
    <GameVignette />
    <GameDialogue />
    <GamePrompt />
    <GameTransition />
    <FPSVisualizer v-if="debugMode" />
    <PauseScreen />
    <GameNoise />
  </section>
</template>

<style lang="scss">
@media (min-width: 1500px) {
  html {
    font-size: 18px;
  }
}

@media (min-width: 1920px) {
  html {
    font-size: 20px;
  }
}

@media (min-width: 2300px) {
  html {
    font-size: 22px;
  }
}

.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Jost, sans-serif;
  cursor: v-bind(cursorSource);

  .game-canvas {
    width: 100vw;
    height: 100vh;
  }
}
</style>
