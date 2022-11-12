<script setup lang="ts">
import { terrainTiles } from '~~/game/data';
import { Settings } from '~~/game/utils';
import { Editor } from './editor';
import EditorTile from './EditorTile.vue';

const canvas = ref<HTMLCanvasElement>();
const editor = ref<Editor>();

const rows = ref(20);
const columns = ref(20);
const ratio = ref(5);
const pan = ref({ x: 0, y: 0 });
const showGrid = ref(true);

const panning = ref(false);
let panningPosition = { x: 0, y: 0 };
const selectedItem = ref('');
const selectedType = ref<'terrain' | 'environment'>('terrain');

const zoomEventHandler = (event: WheelEvent) => {
  const oldRatio = ratio.value;

  if (event.deltaY < 0) {
    ratio.value += 1;
  } else if (ratio.value > 1) {
    ratio.value -= 1;
  }

  // Edit panning to zoom in center
  const x =
    pan.value.x +
    ((oldRatio - ratio.value) / 2) * rows.value * Settings.tileSize;
  const y =
    pan.value.y +
    ((oldRatio - ratio.value) / 2) * columns.value * Settings.tileSize;

  pan.value = { x, y };
};

const mouseEventHandler = (event: MouseEvent) => {
  switch (event.type) {
    case 'mousedown':
      if (event.button === 1) {
        panning.value = true;
        panningPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
      break;

    case 'mouseup':
      panning.value = false;
      break;

    case 'mousemove':
      if (panning.value) {
        const x = event.clientX;
        const y = event.clientY;

        pan.value = {
          x: pan.value.x + x - panningPosition.x,
          y: pan.value.y + y - panningPosition.y,
        };

        panningPosition = { x, y };
      }
      break;

    default:
      break;
  }
};

const mouseMoveHandler = useThrottle((event) => mouseEventHandler(event), 10);

onMounted(() => {
  editor.value = new Editor(
    canvas.value as HTMLCanvasElement,
    rows.value,
    columns.value,
    ratio.value
  );
});

watch([rows, columns, ratio, pan, showGrid], (values) => {
  (editor.value as Editor).updateSettings(...values);
  (editor.value as Editor).render([]);
});
</script>

<template>
  <main class="main">
    <section class="toolkit">
      <h1>Toolkit</h1>
      <label for="ratio">
        Ratio
        <input id="ratio" v-model="ratio" type="number" />
      </label>
      <label for="show-grid">
        Show grid
        <input id="show-grid" v-model="showGrid" type="checkbox" />
      </label>
      <label for="rows">
        Rows
        <input id="rows" v-model="rows" type="number" />
      </label>
      <label for="columns">
        Columns
        <input id="columns" v-model="columns" type="number" />
      </label>
      <ul class="wrapper tile-list">
        <li v-for="(terrain, tile, index) in terrainTiles" :key="index">
          <EditorTile
            :source="terrain.source"
            :x="terrain.x"
            :y="terrain.y"
            :size="Settings.tileSize"
            :selected="selectedType === 'terrain' && selectedItem === tile"
            @click="selectedItem = (tile as string)"
          />
        </li>
      </ul>
    </section>
    <canvas
      ref="canvas"
      class="canvas"
      @mousedown="mouseEventHandler"
      @mouseup="mouseEventHandler"
      @mousemove="mouseMoveHandler"
      @wheel="zoomEventHandler"
    />
  </main>
</template>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.toolkit {
  position: absolute;
  background-color: rgba(white, 0.5);
  font-size: 1rem;
  max-height: 100vh;
  overflow: auto;
}

.canvas {
  width: 100vw;
  height: 100%;
}
</style>
