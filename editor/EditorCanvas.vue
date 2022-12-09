<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Settings } from '~~/game/utils';
import { Editor } from './editor';
import { useEditorStore } from './editor-store';
import EditorExportPopup from './EditorExportPopup.vue';
import EditorToolkit from './EditorToolkit.vue';

const canvas = ref<HTMLCanvasElement>();
let panningPosition = { x: 0, y: 0 };

const store = useEditorStore();
const { rows, columns, ratio, pan, showGrid, mapGrowsAfter } =
  storeToRefs(store);

const clickTerrain = (x: number, y: number, action: 'place' | 'get') => {
  const column = Math.trunc(
    (x - pan.value.x) / Settings.tileSize / ratio.value
  );
  const row = Math.trunc((y - pan.value.y) / Settings.tileSize / ratio.value);

  if (action === 'place') {
    store.editor?.placeTerrain(column, row, store.selectedItem);
    store.editor?.render();
    return;
  }

  const terrain = store.editor?.getTerrain(column, row);
  if (terrain !== undefined) {
    store.selectedItem = terrain;
  }
};

const placeEntity = (x: number, y: number) => {
  const placeX = Math.round((x - pan.value.x) / ratio.value);
  const placeY = Math.round((y - pan.value.y) / ratio.value);

  if (store.selectedItem === null) {
    store.selectedEntity = (store.editor as Editor).selectEntity(
      placeX,
      placeY,
      store.selectedType
    );
    return;
  }

  store.editor?.placeEntity(
    placeX,
    placeY,
    store.selectedItem,
    store.selectedType
  );
  store.editor?.render();
};

const placeInteraction = (x: number, y: number) => {
  const placeX = Math.round((x - pan.value.x) / ratio.value);
  const placeY = Math.round((y - pan.value.y) / ratio.value);

  if (store.selectedItem === null) {
    store.selectedInteraction = (store.editor as Editor).selectInteraction(
      placeX,
      placeY
    );
    return;
  }

  store.editor?.placeInteraction(placeX, placeY);
  store.editor?.render();
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
    // Handle left click
    case 1:
      if (store.selectedType === 'terrain') {
        clickTerrain(event.clientX, event.clientY, 'place');
        return;
      }

      if (event.type !== 'mousedown') {
        return;
      }

      if (store.selectedType === 'interaction') {
        placeInteraction(event.clientX, event.clientY);
        return;
      }

      placeEntity(event.clientX, event.clientY);

      break;

    // Handle right click
    case 2:
      if (event.type !== 'mousedown') {
        return;
      }

      clickTerrain(event.clientX, event.clientY, 'get');

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

  if (event.type === 'mousemove') {
    const x = Math.round((event.clientX - store.pan.x) / store.ratio);
    const y = Math.round((event.clientY - store.pan.y) / store.ratio);
    store.mousePosition = { x, y };
  }
};

const mouseMoveHandler = useThrottle((event) => mouseEventHandler(event), 10);

onMounted(() => {
  store.editor = new Editor(
    canvas.value as HTMLCanvasElement,
    store.rows,
    store.columns,
    store.ratio
  );
});

onUnmounted(() => {
  store.editor = undefined;
});

watch([rows, columns, ratio, pan, showGrid, mapGrowsAfter], (values) => {
  if (store.editor) {
    store.editor.updateSettings(...values);
    store.editor.render();
  }
});
</script>

<template>
  <main class="main">
    <canvas
      ref="canvas"
      class="canvas"
      @mousedown="mouseEventHandler"
      @mouseup="mouseEventHandler"
      @mousemove="mouseMoveHandler"
      @wheel="zoomEventHandler"
      @contextmenu.prevent=""
    />
    <EditorToolkit />
    <EditorExportPopup v-if="store.showPopup" />
  </main>
</template>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  color-scheme: dark;
}

.canvas {
  width: 100vw;
  height: 100vh;
  cursor: crosshair;
}
</style>
