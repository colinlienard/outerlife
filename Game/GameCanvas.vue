<script setup lang="ts">
import Game from './Game';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (canvas.value) {
    // eslint-disable-next-line no-new
    new Game(canvas.value);
  }
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
