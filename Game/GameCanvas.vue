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

    window.addEventListener('resize', setCanvasSize);

    const renderer = new Renderer(canvas.value);
    console.log(renderer);
  }
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped lang="scss">
canvas {
  background-color: #cecece;
}
</style>
