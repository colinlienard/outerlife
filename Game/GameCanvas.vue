<script setup lang="ts">
import Renderer from './Renderer';

const canvas = ref<HTMLCanvasElement>();

const setCanvasSize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }
};

onMounted(() => {
  if (canvas.value) {
    setCanvasSize();
    const renderer = new Renderer(canvas.value, 200);

    window.addEventListener('resize', () => {
      setCanvasSize();
      renderer.updateSize(200);
    });
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
