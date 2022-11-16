<script setup lang="ts">
import { SpriteComponent } from '~~/game/components';
import { environmentsIndex, terrainsIndex } from '~~/game/data';
import { Map, Settings } from '~~/game/utils';
import { Editor } from './editor';
import EditorTile from './EditorTile.vue';
import FileUploader from './FileUploader.vue';

const canvas = ref<HTMLCanvasElement>();
const editor = ref<Editor>();

const rows = ref(20);
const columns = ref(20);
const addSizeAfter = ref(true);
const ratio = ref(5);
const pan = ref({ x: 0, y: 0 });
const showGrid = ref(true);

let panningPosition = { x: 0, y: 0 };
const selectedItem = ref<number | null>(null);
const selectedType = ref<'terrain' | 'environment'>('terrain');
const selectedEnvironment = ref<{ x: number; y: number; index: number } | null>(
  null
);

const placeTerrain = (x: number, y: number) => {
  const column = Math.trunc(
    (x - pan.value.x) / Settings.tileSize / ratio.value
  );
  const row = Math.trunc((y - pan.value.y) / Settings.tileSize / ratio.value);

  editor.value?.placeTerrain(column, row, selectedItem.value);
  editor.value?.render();
};

const placeEnvironment = (x: number, y: number) => {
  const placeX = Math.round((x - pan.value.x) / ratio.value);
  const placeY = Math.round((y - pan.value.y) / ratio.value);

  if (selectedItem.value === null) {
    selectedEnvironment.value = (editor.value as Editor).selectEnvironment(
      placeX,
      placeY
    );
    return;
  }

  editor.value?.placeEnvironment(placeX, placeY, selectedItem.value);
  editor.value?.render();
};

const updateEnvironment = () => {
  if (selectedEnvironment.value) {
    editor.value?.updateEnvironment(
      selectedEnvironment.value.x,
      selectedEnvironment.value.y,
      selectedEnvironment.value.index
    );
    editor.value?.render();
  }
};

const deleteEnvironment = () => {
  if (selectedEnvironment.value) {
    editor.value?.deleteEnvironment(selectedEnvironment.value.index);
    editor.value?.render();
    selectedEnvironment.value = null;
  }
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
    ((oldRatio - ratio.value) / 2) * columns.value * Settings.tileSize;
  const y =
    pan.value.y +
    ((oldRatio - ratio.value) / 2) * rows.value * Settings.tileSize;

  pan.value = { x, y };
};

const mouseEventHandler = (event: MouseEvent) => {
  switch (event.buttons) {
    // Handle click
    case 1:
      if (selectedType.value === 'environment' && event.type === 'mousedown') {
        placeEnvironment(event.clientX, event.clientY);
        return;
      }

      if (selectedType.value === 'terrain') {
        placeTerrain(event.clientX, event.clientY);
      }
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

const downloadMap = () => {
  const map = editor.value?.getMap();
  useDownload(map, 'map.json');
};

const handleMapUpload = (data: string) => {
  try {
    const map = JSON.parse(data) as Map;

    rows.value = map.rows;
    columns.value = map.columns;

    setTimeout(() => {
      editor.value?.setTerrainsAndEnvironments(map.terrains, map.environments);
      editor.value?.render();
    }, 10);
  } catch {
    // eslint-disable-next-line no-alert
    alert('File error.');
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

watch([rows, columns, ratio, pan, showGrid, addSizeAfter], (values) => {
  editor.value?.updateSettings(...values);
  editor.value?.render();
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
      <button @click="addSizeAfter = !addSizeAfter">
        Add/remove {{ addSizeAfter ? 'after' : 'before' }}
      </button>
      <br />
      <button @click="downloadMap">Download map as json</button>
      <FileUploader @upload="handleMapUpload" />
      <br />
      <button @click="selectedType = 'terrain'">Terrains</button>
      <button @click="selectedType = 'environment'">Environments</button>
      <div v-if="selectedEnvironment">
        <label for="x">
          x
          <input
            id="x"
            v-model="selectedEnvironment.x"
            type="number"
            @change="updateEnvironment"
          />
        </label>
        <label for="y">
          y
          <input
            id="y"
            v-model="selectedEnvironment.y"
            type="number"
            @change="updateEnvironment"
          />
        </label>
        <button @click="deleteEnvironment">Delete</button>
      </div>
      <ul v-if="selectedType === 'terrain'">
        <li>
          <EditorTile
            source="/sprites/eraser.png"
            :x="0"
            :y="0"
            :size="Settings.tileSize"
            :selected="selectedItem === null"
            @click="selectedItem = null"
          />
        </li>
        <li v-for="([source, x, y], index) in terrainsIndex" :key="index">
          <EditorTile
            :source="source"
            :x="x"
            :y="y"
            :size="Settings.tileSize"
            :selected="selectedItem === index"
            @click="selectedItem = index"
          />
        </li>
      </ul>
      <ul v-if="selectedType === 'environment'">
        <li>
          <EditorTile
            source="/sprites/player.png"
            :x="0"
            :y="0"
            :size="Settings.tileSize"
            :selected="selectedItem === null"
            @click="selectedItem = null"
          />
        </li>
        <li v-for="(environment, index) in environmentsIndex" :key="index">
          <EditorTile
            :source="new environment(0, 0).get(SpriteComponent).source"
            :x="new environment(0, 0).get(SpriteComponent).sourceX"
            :y="new environment(0, 0).get(SpriteComponent).sourceY"
            :size="
              new environment(0, 0).get(SpriteComponent).width <
              new environment(0, 0).get(SpriteComponent).height
                ? new environment(0, 0).get(SpriteComponent).width
                : new environment(0, 0).get(SpriteComponent).height
            "
            :selected="selectedItem === index"
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
