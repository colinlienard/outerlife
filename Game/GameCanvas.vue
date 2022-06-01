<script setup lang="ts">
import Game from './Game';

const canvas = ref<HTMLCanvasElement>();
const game = ref();

onMounted(() => {
  if (canvas.value) {
    game.value = new Game(canvas.value);
  }
});
onUnmounted(() => {
  game.value.destructor();
});
</script>

<template>
  <canvas ref="canvas" class="canvas" moz-opaque></canvas>
</template>

<style scoped lang="scss">
.canvas {
  background-color: #cecece;
}
</style>
