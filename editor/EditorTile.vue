<script setup lang="ts">
import { AnimationComponent, SpriteComponent } from '~~/game/components';
import { EntityConstructor, Settings } from '~~/game/utils';

const props = defineProps<{
  terrain?: [string, number, number];
  entity?: EntityConstructor;
  selected: boolean;
}>();

const canvas = ref<HTMLCanvasElement>();
const tileSize = 48;

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = tileSize;
    canvas.value.height = tileSize;
    const context = canvas.value.getContext('2d') as CanvasRenderingContext2D;
    context.imageSmoothingEnabled = false;

    if (props.terrain) {
      const [source, x, y] = props.terrain;

      const image = new Image();
      image.src = source;
      image.onload = () => {
        context.drawImage(
          image,
          x, // position x in the source image
          y, // position y in the source image
          Settings.tileSize, // width of the sprite in the source image
          Settings.tileSize, // height of the sprite in the source image
          0, // position x in the canvas
          0, // position y in the canvas
          tileSize, // width of the sprite in the canvas
          tileSize // height of the sprite in the canvas
        );
      };
      return;
    }

    if (props.entity) {
      // eslint-disable-next-line new-cap
      const entity = new props.entity(0, 0);
      const { source, sourceX, sourceY, width, height } =
        entity.get(SpriteComponent);
      const animation = entity.get(AnimationComponent);
      const size = width < height ? width : height;

      const image = new Image();
      image.src = source;
      image.onload = () => {
        context.drawImage(
          image,
          animation ? 0 : sourceX, // position x in the source image
          animation ? size : sourceY, // position y in the source image
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
    <canvas ref="canvas" class="canvas" />
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
