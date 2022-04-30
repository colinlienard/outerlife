<script setup lang="ts">
import Editor from './Editor';
import EditorTile from './EditorTile.vue';
import TerrainTiles from '~~/Game/Entities/Terrains/TerrainTiles';

const tileSize = 16;
const rows = ref(10);
const columns = ref(20);
const ratio = ref(5);

const showGrid = ref(true);
const mouseDown = ref(false);
const selected = ref<string>('000');

const canvas = ref<HTMLCanvasElement>();
const editor = ref<Editor>();

onMounted(() => {
  if (canvas.value) {
    editor.value = new Editor(canvas.value, tileSize);
    editor.value?.updateSize(rows.value, columns.value, ratio.value);
    editor.value.fillWithVoid();
    editor.value.bindImages();
    editor.value?.drawMap();
  }
});

onUpdated(() => {
  editor.value?.updateSize(rows.value, columns.value, ratio.value);
  editor.value?.drawMap();
});

const handlePlace = (event: MouseEvent) => {
  if (event.type === 'click' || mouseDown.value) {
    const column = Math.trunc(event.offsetX / tileSize / ratio.value);
    const row = Math.trunc(event.offsetY / tileSize / ratio.value);
    editor.value?.placeTile(row, column, selected.value);
  }
};

const getOuput = () => {
  const output = editor.value?.tilemap.map;
  if (output) {
    navigator.clipboard.writeText(JSON.stringify(output));
  }
};
</script>

<template>
  <main>
    <div class="canvas-container">
      <div :class="['grid', { visible: showGrid }]"></div>
      <canvas
        ref="canvas"
        class="canvas"
        moz-opaque
        :width="columns * ratio * tileSize"
        :height="rows * ratio * tileSize"
        @click="handlePlace"
        @mousedown="mouseDown = true"
        @mouseup="mouseDown = false"
        v-on="mouseDown ? { mousemove: handlePlace } : {}"
      ></canvas>
    </div>
    <div class="toolkit">
      <label>
        Ratio
        <input v-model="ratio" type="number" name="rows" />
      </label>
      <label>
        Rows
        <input v-model="rows" type="number" name="rows" />
      </label>
      <label for="columns">
        Columns
        <input v-model="columns" type="number" name="columns" />
      </label>
      <label for="showGrid">
        Show grid
        <input v-model="showGrid" type="checkbox" name="showGrid" />
      </label>
      <button type="button" @click="getOuput">Get output</button>
      <ul>
        <li v-for="(terrain, tile, index) in TerrainTiles" :key="index">
          <EditorTile
            :source="terrain.source"
            :x="terrain.x"
            :y="terrain.y"
            :selected="selected === tile"
            @click="selected = (tile as string)"
          />
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped lang="scss">
.canvas-container {
  position: relative;
  width: fit-content;

  .canvas {
    background-color: #cecece;
  }

  .grid {
    position: absolute;
    inset: 0;
    background-size: calc(v-bind(ratio) * v-bind(tileSize) * 1px)
      calc(v-bind(ratio) * v-bind(tileSize) * 1px);
    z-index: 1;
    pointer-events: none;

    &.visible {
      background-image: repeating-linear-gradient(
          white 0 1px,
          transparent 1px 100%
        ),
        repeating-linear-gradient(90deg, white 0 1px, transparent 1px 100%);
    }
  }
}

.toolkit {
  font-size: initial;
}
</style>
