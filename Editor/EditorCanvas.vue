<script setup lang="ts">
import Editor from './Editor';

const tileSize = 16;
const rows = ref(10);
const columns = ref(20);
const ratio = ref(5);
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (canvas.value) {
    // eslint-disable-next-line no-new
    new Editor(canvas.value);
  }
});
</script>

<template>
  <div>
    <div class="canvas-container">
      <div class="grid"></div>
      <canvas
        ref="canvas"
        class="canvas"
        moz-opaque
        :width="columns * ratio * tileSize"
        :height="rows * ratio * tileSize"
      ></canvas>
    </div>
    <div class="toolkit">
      <label for="rows">
        Rows
        <input v-model="rows" type="number" name="rows" />
      </label>
      <label for="columns">
        Columns
        <input v-model="columns" type="number" name="columns" />
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas-container {
  position: relative;

  .canvas {
    background-color: #cecece;
  }

  .grid {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        #000 0 1px,
        transparent 1px 100%
      ),
      repeating-linear-gradient(90deg, white 0 1px, transparent 1px 100%);
    background-size: calc(v-bind(ratio) * v-bind(tileSize) * 1px)
      calc(v-bind(ratio) * v-bind(tileSize) * 1px);
    z-index: 1;
    pointer-events: none;
  }
}
</style>
