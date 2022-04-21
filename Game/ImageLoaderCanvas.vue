<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (canvas.value) {
    const context = canvas.value.getContext('2d');
    const sprites = ['player'];
    sprites.forEach((sprite) => {
      const image = new Image();
      image.src = `assets/sprites/${sprite}`;
      context?.drawImage(image, 0, 0);
    });
  }
});
</script>

<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<style scoped lang="scss">
.canvas {
  display: none;
}
</style>
