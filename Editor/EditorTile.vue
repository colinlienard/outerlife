<script setup lang="ts">
const { source, x, y, size, selected } = defineProps<{
  source: string;
  x: number;
  y: number;
  size: number;
  selected: boolean;
}>();

const canvas = ref<HTMLCanvasElement>();
const tileSize = 48;

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = tileSize;
    canvas.value.height = tileSize;

    const context = canvas.value.getContext('2d');
    if (context) {
      context.imageSmoothingEnabled = false;

      const image = new Image();
      image.src = `/sprites/${source}.png`;
      image.onload = () => {
        context.drawImage(
          image,
          x, // position x in the source image
          y, // position y in the source image
          size, // width of the sprite in the source image
          size, // height of the sprite in the source image
          0, // position x in the canvas
          0, // position y in the canvas
          tileSize, // width of the sprite in the canvas
          tileSize // height of the sprite in the canvas
        );
      };
    }
  }
});
</script>

<template>
  <button :class="['tile', { selected: selected }]" @click="$emit('click')">
    <canvas ref="canvas" class="canvas"></canvas>
  </button>
</template>

<style scoped lang="scss">
.tile {
  width: calc(v-bind(tileSize) * 1px);
  aspect-ratio: 1 / 1;
  position: relative;

  &:hover {
    opacity: 0.8;
  }

  &.selected {
    outline: 3px solid white;
    z-index: 1;
  }

  .canvas {
    position: absolute;
    inset: 0;
  }
}
</style>
