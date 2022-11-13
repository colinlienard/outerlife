<script setup lang="ts">
import { terrainsIndex } from '~~/game/data';
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
const map = ref<(number | null)[]>([]);

let panningPosition = { x: 0, y: 0 };
const selectedItem = ref<number | null>(null);
const selectedType = ref<'terrain' | 'environment'>('terrain');

const placeTerrain = (x: number, y: number) => {
  const column = Math.trunc(
    (x - pan.value.x) / Settings.tileSize / ratio.value
  );
  const row = Math.trunc((y - pan.value.y) / Settings.tileSize / ratio.value);
  const index = row * columns.value + column;

  // Update map
  map.value = map.value.map((v, i) => (i === index ? selectedItem.value : v));

  // Render
  (editor.value as Editor).render(map.value);
};

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
  switch (event.buttons) {
    // Handle click
    case 1:
      placeTerrain(event.clientX, event.clientY);
      break;

    // Handle pan
    case 4:
      if (event.type === 'mousedown') {
        panningPosition = {
          x: event.clientX,
          y: event.clientY,
        };
        return;
      }

      if (event.type === 'mousemove') {
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

  map.value = [...new Array(rows.value * columns.value)].map(() => null);
});

watch([rows, columns, ratio, pan, showGrid], (values) => {
  (editor.value as Editor).updateSettings(...values);
  (editor.value as Editor).render(map.value);
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
        <li>
          <EditorTile
            source="/sprites/eraser.png"
            :x="0"
            :y="0"
            :size="Settings.tileSize"
            :selected="selectedType === 'terrain' && selectedItem === null"
            @click="selectedItem = null"
          />
        </li>
        <li v-for="([source, x, y], index) in terrainsIndex" :key="index">
          <EditorTile
            :source="source"
            :x="x"
            :y="y"
            :size="Settings.tileSize"
            :selected="selectedType === 'terrain' && selectedItem === index"
            @click="selectedItem = index"
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
