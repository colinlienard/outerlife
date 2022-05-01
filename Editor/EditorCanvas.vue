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
const toolkitOpen = ref(true);
const toolkitWidth = ref(350);
const oldToolkitValue = ref(0);

const canvas = ref<HTMLCanvasElement>();
const editor = ref<Editor>();

onMounted(() => {
  if (canvas.value) {
    editor.value = new Editor(canvas.value, tileSize);
    editor.value.updateSize(rows.value, columns.value, ratio.value);
    editor.value.fillWithVoid();
    editor.value.bindImages();
    editor.value.drawMap();
  }
});

onUpdated(() => {
  editor.value?.updateSize(rows.value, columns.value, ratio.value);
  editor.value?.drawMap();
});

const getOuput = () => {
  const output = editor.value?.tilemap;
  if (output) {
    navigator.clipboard.writeText(JSON.stringify(output));
  }
};

const handleDrag = (event: DragEvent) => {
  switch (event.type) {
    case 'dragstart':
      oldToolkitValue.value = toolkitWidth.value;
      break;
    case 'drag':
      if (event.offsetX > -1000) {
        toolkitWidth.value = oldToolkitValue.value - event.offsetX;
      }
      break;
    case 'dragend':
      oldToolkitValue.value = toolkitWidth.value;
      break;
    default:
      break;
  }
};

const handleInput = (event: Event) => {
  editor.value?.changeMap((event.target as HTMLInputElement).value as string);
  (event.target as HTMLInputElement).value = '';
};

const handlePlace = (event: MouseEvent) => {
  if (event.type === 'click' || mouseDown.value) {
    const column = Math.trunc(event.offsetX / tileSize / ratio.value);
    const row = Math.trunc(event.offsetY / tileSize / ratio.value);
    editor.value?.placeTile(row, column, selected.value);
  }
};
</script>

<template>
  <main class="main">
    <section class="canvas-container">
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
    </section>
    <section :class="['toolkit', { closed: !toolkitOpen }]">
      <div
        class="dragger"
        draggable
        @drag="handleDrag"
        @dragstart="handleDrag"
        @dragend="handleDrag"
      ></div>
      <header class="header">
        Toolkit
        <button v-if="toolkitOpen" class="reduce" @click="toolkitOpen = false">
          -
        </button>
        <button v-else class="reduce" @click="toolkitOpen = true">+</button>
      </header>
      <div class="content">
        <div class="wrapper">
          <label class="label" for="ratio">
            Ratio:
            <input id="ratio" v-model="ratio" class="input" type="number" />
          </label>
          <label class="label" for="showGrid">
            Show grid:
            <input id="showGrid" v-model="showGrid" type="checkbox" />
          </label>
        </div>
        <hr class="separator" />
        <div class="wrapper">
          <label class="label" for="rows">
            Rows:
            <input id="rows" v-model="rows" class="input" type="number" />
          </label>
          <label class="label" for="columns">
            Columns:
            <input id="columns" v-model="columns" class="input" type="number" />
          </label>
        </div>
        <hr class="separator" />
        <div class="wrapper">
          <label class="label" for="input">
            Insert input:
            <input
              id="input"
              class="input"
              type="text"
              placeholder="here..."
              @change="handleInput"
            />
          </label>
          <button class="button" type="button" @click="getOuput">
            Get output
          </button>
        </div>
        <hr class="separator" />
        <ul class="wrapper tile-list">
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
    </section>
  </main>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '~/styles/variables';

.main {
  background-color: variables.$dark-1;
  color-scheme: dark;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.canvas-container {
  position: relative;
  width: fit-content;

  .canvas {
    background-color: variables.$dark-2;
    cursor: crosshair;
  }

  .grid {
    $grid-color: white;

    background-size: calc(v-bind(ratio) * v-bind(tileSize) * 1px)
      calc(v-bind(ratio) * v-bind(tileSize) * 1px);
    outline: 1px solid $grid-color;
    background-image: repeating-linear-gradient(
        $grid-color 0 1px,
        transparent 1px 100%
      ),
      repeating-linear-gradient(90deg, $grid-color 0 1px, transparent 1px 100%);
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0;

    &.visible {
      opacity: 0.5;
    }
  }
}

.toolkit {
  font-size: 1rem;
  color: white;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: variables.$dark-2;
  width: calc(v-bind(toolkitWidth) * 1px);
  z-index: 1;

  .dragger {
    position: absolute;
    top: 0;
    right: 100%;
    height: 100%;
    width: 3px;
    transform: translateX(50%);
    background-color: variables.$dark-4;
    cursor: ew-resize;
    z-index: 1;
    transition: width 0.2s ease-in-out;

    &:hover {
      width: 8px;
      background-color: variables.$accent;
    }

    &:active {
      background-color: white;
    }
  }

  .header {
    background-color: variables.$dark-3;
    text-align: center;
    padding: 0.5rem 0;
    position: relative;

    .reduce {
      position: absolute;
      inset: 0 0 0 auto;
      aspect-ratio: 1 / 1;
      background-color: variables.$dark-4;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .wrapper {
    padding: 1rem;
    display: flex;
    gap: 2rem;
  }

  .separator {
    border: none;
    border-top: 1px solid variables.$dark-4;
    margin: 0 1rem;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .input {
      padding: 0.5rem;
      background-color: variables.$dark-3;
      width: 4rem;
    }
  }

  .button {
    padding: 0.5rem;
    background-color: variables.$accent;
    color: variables.$dark-2;

    &:hover {
      background-color: color.adjust(variables.$accent, $lightness: 20%);
    }

    &:active {
      background-color: white;
    }
  }

  .tile-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    max-height: 16rem;
    overflow: auto;
  }

  &.closed {
    width: 10rem;

    .dragger,
    .content {
      display: none;
    }
  }
}
</style>
