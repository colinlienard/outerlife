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
    <section class="toolkit">
      <header class="header">Toolkit</header>
      <div class="wrapper">
        <label class="label" for="ratio">
          Ratio
          <input id="ratio" v-model="ratio" class="input" type="number" />
        </label>
        <label class="label" for="showGrid">
          Show grid
          <input id="showGrid" v-model="showGrid" type="checkbox" />
        </label>
      </div>
      <hr class="separator" />
      <div class="wrapper">
        <label class="label" for="rows">
          Rows
          <input id="rows" v-model="rows" class="input" type="number" />
        </label>
        <label class="label" for="columns">
          Columns
          <input id="columns" v-model="columns" class="input" type="number" />
        </label>
      </div>
      <hr class="separator" />
      <div class="wrapper">
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
    </section>
  </main>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '~/styles/variables';

.main {
  background-color: variables.$dark-1;
  color-scheme: dark;
  min-height: 100vh;
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
  width: 20rem;
  z-index: 1;

  .header {
    background-color: variables.$dark-3;
    text-align: center;
    padding: 0.5rem 0;
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
      background-color: color.adjust(variables.$accent, $lightness: -10%);
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
}
</style>
