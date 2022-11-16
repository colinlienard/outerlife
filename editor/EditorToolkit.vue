<script setup lang="ts">
import { SpriteComponent } from '~~/game/components';
import { environmentsIndex, terrainsIndex } from '~~/game/data';
import { Map, Settings } from '~~/game/utils';
import { useEditorStore } from './editor-store';
import EditorTile from './EditorTile.vue';
import FileUploader from './FileUploader.vue';

const store = useEditorStore();

const updateEnvironment = () => {
  if (store.selectedEnvironment) {
    store.editor?.updateEnvironment(
      store.selectedEnvironment.x,
      store.selectedEnvironment.y,
      store.selectedEnvironment.index
    );
    store.editor?.render();
  }
};

const deleteEnvironment = () => {
  if (store.selectedEnvironment) {
    store.editor?.deleteEnvironment(store.selectedEnvironment.index);
    store.editor?.render();
    store.selectedEnvironment = null;
  }
};

const downloadMap = () => {
  const map = store.editor?.getMap();
  useDownload(map, 'map.json');
};

const handleMapUpload = (data: string) => {
  try {
    const map = JSON.parse(data) as Map;

    store.rows = map.rows;
    store.columns = map.columns;

    setTimeout(() => {
      store.editor?.setTerrainsAndEnvironments(map.terrains, map.environments);
      store.editor?.render();
    }, 10);
  } catch {
    // eslint-disable-next-line no-alert
    alert('File error.');
  }
};
</script>

<template>
  <section class="toolkit">
    <h1>Toolkit</h1>
    <label for="ratio">
      Ratio
      <input id="ratio" v-model="store.ratio" type="number" />
    </label>
    <label for="show-grid">
      Show grid
      <input id="show-grid" v-model="store.showGrid" type="checkbox" />
    </label>
    <label for="rows">
      Rows
      <input id="rows" v-model="store.rows" type="number" />
    </label>
    <label for="columns">
      Columns
      <input id="columns" v-model="store.columns" type="number" />
    </label>
    <button @click="store.addSizeAfter = !store.addSizeAfter">
      Add/remove {{ store.addSizeAfter ? 'after' : 'before' }}
    </button>
    <br />
    <button @click="downloadMap">Download map as json</button>
    <FileUploader @upload="handleMapUpload" />
    <br />
    <button @click="store.selectedType = 'terrain'">Terrains</button>
    <button @click="store.selectedType = 'environment'">Environments</button>
    <button @click="store.selectedType = 'npcs'">NPCs</button>
    <button @click="store.selectedType = 'interactions'">Interactions</button>
    <div v-if="store.selectedEnvironment">
      <label for="x">
        x
        <input
          id="x"
          v-model="store.selectedEnvironment.x"
          type="number"
          @change="updateEnvironment"
        />
      </label>
      <label for="y">
        y
        <input
          id="y"
          v-model="store.selectedEnvironment.y"
          type="number"
          @change="updateEnvironment"
        />
      </label>
      <button @click="deleteEnvironment">Delete</button>
    </div>
    <ul v-if="store.selectedType === 'terrain'">
      <li>
        <EditorTile
          source="/sprites/eraser.png"
          :x="0"
          :y="0"
          :size="Settings.tileSize"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
        />
      </li>
      <li v-for="([source, x, y], index) in terrainsIndex" :key="index">
        <EditorTile
          :source="source"
          :x="x"
          :y="y"
          :size="Settings.tileSize"
          :selected="store.selectedItem === index"
          @click="store.selectedItem = index"
        />
      </li>
    </ul>
    <ul v-if="store.selectedType === 'environment'">
      <li>
        <EditorTile
          source="/sprites/player.png"
          :x="0"
          :y="0"
          :size="Settings.tileSize"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
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
          :selected="store.selectedItem === index"
          @click="store.selectedItem = index"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.toolkit {
  position: absolute;
  top: 0;
  background-color: rgba(white, 0.5);
  font-size: 1rem;
  max-height: 100vh;
  overflow: auto;
}
</style>
