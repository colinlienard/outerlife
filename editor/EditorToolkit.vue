<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { environmentsIndex, organismsIndex, terrainsIndex } from '~~/game/data';
import { GameMap } from '~~/game/utils';
import { useEditorStore } from './editor-store';
import EditorTile from './EditorTile.vue';
import FileUploader from './FileUploader.vue';

const store = useEditorStore();
const { selectedItem, selectedType } = storeToRefs(store);

const updateEntity = () => {
  if (store.selectedEntity) {
    store.editor?.updateEntity(
      store.selectedEntity.x,
      store.selectedEntity.y,
      store.selectedEntity.index
    );
    store.editor?.render();
  }
};

const deleteEntity = () => {
  if (store.selectedEntity) {
    store.editor?.deleteEntity(store.selectedEntity.index);
    store.editor?.render();
    store.selectedEntity = null;
  }
};

const updateInteraction = () => {
  if (store.selectedInteraction) {
    store.editor?.updateInteraction(
      store.selectedInteraction,
      store.selectedInteraction.index
    );
    store.editor?.render();
  }
};

const deleteInteraction = () => {
  if (store.selectedInteraction) {
    store.editor?.deleteInteraction(store.selectedInteraction.index);
    store.editor?.render();
    store.selectedInteraction = null;
  }
};

const downloadMap = () => {
  const map = store.editor?.getMap();
  useDownload(map, 'map.json');
};

const handleMapUpload = (data: string) => {
  try {
    const map = JSON.parse(data) as GameMap;

    store.rows = map.rows;
    store.columns = map.columns;

    setTimeout(() => {
      store.editor?.setMapData(map);
      store.editor?.render();
    }, 10);
  } catch {
    // eslint-disable-next-line no-alert
    alert('File error.');
  }
};

watch([selectedItem, selectedType], () => {
  store.selectedEntity = null;
  store.selectedInteraction = null;
});

watch([selectedType], () => {
  store.selectedItem = null;
});
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
    <button @click="store.selectedType = 'organism'">Organisms</button>
    <button @click="store.selectedType = 'interaction'">Interactions</button>
    <div v-if="store.selectedEntity">
      <label for="x">
        x
        <input
          id="x"
          v-model="store.selectedEntity.x"
          type="number"
          @change="updateEntity"
        />
      </label>
      <label for="y">
        y
        <input
          id="y"
          v-model="store.selectedEntity.y"
          type="number"
          @change="updateEntity"
        />
      </label>
      <button @click="deleteEntity">Delete</button>
    </div>
    <div v-if="store.selectedInteraction">
      <label for="x">
        x
        <input
          id="x"
          v-model="store.selectedInteraction.x"
          type="number"
          @change="updateInteraction"
        />
      </label>
      <label for="y">
        y
        <input
          id="y"
          v-model="store.selectedInteraction.y"
          type="number"
          @change="updateInteraction"
        />
      </label>
      <label for="width">
        width
        <input
          id="width"
          v-model="store.selectedInteraction.width"
          type="number"
          @change="updateInteraction"
        />
      </label>
      <label for="height">
        height
        <input
          id="height"
          v-model="store.selectedInteraction.height"
          type="number"
          @change="updateInteraction"
        />
      </label>
      <label for="type">
        height
        <select
          id="type"
          v-model="store.selectedInteraction.data.type"
          @change="updateInteraction"
        >
          <option value="switch-map">Map switcher</option>
        </select>
      </label>
      <div v-if="store.selectedInteraction.data.type === 'switch-map'">
        <label for="map">
          map
          <input
            id="map"
            v-model="store.selectedInteraction.data.map"
            type="text"
            @change="updateInteraction"
          />
        </label>
        <label for="player-x">
          player x
          <input
            id="player-x"
            v-model="store.selectedInteraction.data.playerX"
            type="number"
            @change="updateInteraction"
          />
        </label>
        <label for="player-y">
          player y
          <input
            id="player-y"
            v-model="store.selectedInteraction.data.playerY"
            type="number"
            @change="updateInteraction"
          />
        </label>
      </div>
      <button @click="deleteInteraction">Delete</button>
    </div>
    <ul v-if="store.selectedType === 'terrain'">
      <li>
        <EditorTile
          :terrain="['/sprites/editor-tools.png', 0, 0]"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
        />
      </li>
      <li v-for="(terrain, index) in terrainsIndex" :key="index">
        <EditorTile
          :terrain="terrain"
          :selected="store.selectedItem === index"
          @click="store.selectedItem = index"
        />
      </li>
    </ul>
    <ul v-if="store.selectedType === 'environment'">
      <li>
        <EditorTile
          :terrain="['/sprites/editor-tools.png', 16, 0]"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
        />
      </li>
      <li v-for="(environment, index) in environmentsIndex" :key="index">
        <EditorTile
          :entity="environment"
          :selected="store.selectedItem === index"
          @click="store.selectedItem = index"
        />
      </li>
    </ul>
    <ul v-if="store.selectedType === 'organism'">
      <li>
        <EditorTile
          :terrain="['/sprites/editor-tools.png', 16, 0]"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
        />
      </li>
      <li v-for="(organism, index) in organismsIndex" :key="index">
        <EditorTile
          :entity="organism"
          :selected="store.selectedItem === index"
          @click="store.selectedItem = index"
        />
      </li>
    </ul>
    <ul v-if="store.selectedType === 'interaction'">
      <li>
        <EditorTile
          :terrain="['/sprites/editor-tools.png', 16, 0]"
          :selected="store.selectedItem === null"
          @click="store.selectedItem = null"
        />
      </li>
      <li>
        <EditorTile
          :terrain="['/sprites/player.png', 16, 0]"
          :selected="store.selectedItem === 1"
          @click="store.selectedItem = 1"
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
