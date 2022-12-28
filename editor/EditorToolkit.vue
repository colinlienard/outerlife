<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { environmentsIndex, organismsIndex, terrainsIndex } from '~~/game/data';
import { GameMap } from '~~/game/utils';
import { useEditorStore } from './editor-store';
import EditorTypeSelector from './EditorTypeSelector.vue';
import EditorInput from './EditorInput.vue';
import EditorTile from './EditorTile.vue';
import FileUploader from './FileUploader.vue';

const store = useEditorStore();
const { selectedItem, selectedType } = storeToRefs(store);

const deleteEntity = () => {
  if (store.selectedEntity) {
    store.editor?.deleteEntity(store.selectedEntity.index);
    store.editor?.render();
    store.selectedEntity = null;
  }
};

const deleteInteraction = () => {
  if (store.selectedInteraction) {
    store.editor?.deleteInteraction(store.selectedInteraction.index);
    store.editor?.render();
    store.selectedInteraction = null;
  }
};

const handleMapUpload = (data: string) => {
  try {
    const map = JSON.parse(data) as GameMap;

    store.rows = map.rows;
    store.columns = map.columns;
    const { postProcessing, ambiantSound, music } = map;
    store.exportSettings = {
      postProcessing,
      ambiantSound,
      music,
    };

    setTimeout(() => {
      store.editor?.setMapData(map);
      store.editor?.render();
    }, 10);
  } catch {
    // eslint-disable-next-line no-alert
    alert('File error.');
  }
};

const changeInteractionType = () => {
  if (!store.selectedInteraction) {
    return;
  }

  const selectedInteraction = store.editor?.changeInteractionType(
    store.selectedInteraction.data.type,
    store.selectedInteraction.index
  );

  if (selectedInteraction) {
    store.selectedInteraction = {
      ...store.selectedInteraction,
      ...selectedInteraction,
    };
  }
};

watch([selectedItem, selectedType], () => {
  store.selectedEntity = null;
  store.selectedInteraction = null;
});

watch([selectedType], () => {
  store.selectedItem = null;
});

watch([() => store.selectedEntity?.x, () => store.selectedEntity?.y], () => {
  if (store.selectedEntity) {
    const { x, y, index } = store.selectedEntity;
    store.editor?.updateEntity(x, y, index);
    store.editor?.render();
  }
});

watch(
  () => store.selectedInteraction,
  (selectedInteraction, oldSelectedInteraction) => {
    if (!selectedInteraction) {
      return;
    }

    if (selectedInteraction.data.type !== oldSelectedInteraction?.data.type) {
      return;
    }

    const { index, ...interaction } = selectedInteraction;
    store.editor?.updateInteraction(interaction, index);
    store.editor?.render();
  },
  { deep: true }
);
</script>

<template>
  <div class="toolkit">
    <header class="top-tag">
      <p>{{ store.mousePosition.x }}</p>
      <p>x</p>
      <p>{{ store.mousePosition.y }}</p>
    </header>
    <section class="section">
      <h2 class="title">Aspect</h2>
      <div class="wrapper">
        <EditorInput v-model="store.ratio" label="Ratio" type="number" />
        <EditorInput
          v-model="store.showGrid"
          :label="store.showGrid ? 'Grid shown' : 'Grid hidden'"
          type="checkbox"
        />
      </div>
    </section>
    <section class="section">
      <h2 class="title">Map size</h2>
      <div class="wrapper">
        <EditorInput v-model="store.rows" label="Rows" type="number" />
        <EditorInput v-model="store.columns" label="Columns" type="number" />
      </div>
      <EditorInput
        v-model="store.mapGrowsAfter"
        :label="`Add/remove ${store.mapGrowsAfter ? 'after' : 'before'}`"
        type="checkbox"
      />
    </section>
    <section class="section">
      <h2 class="title">File</h2>
      <div class="wrapper">
        <FileUploader class="upload" @upload="handleMapUpload">
          Import
        </FileUploader>
        <button class="download" @click="store.showPopup = true">Export</button>
      </div>
    </section>
    <section class="section section-fill">
      <h2 class="title">World</h2>
      <div class="horizontal-scroller" title="Press shift to scroll">
        <EditorTypeSelector type="terrain">Terrains</EditorTypeSelector>
        <EditorTypeSelector type="environment">Environments</EditorTypeSelector>
        <EditorTypeSelector type="organism">Organisms</EditorTypeSelector>
        <EditorTypeSelector type="interaction">Interactions</EditorTypeSelector>
      </div>
      <ul v-if="store.selectedType === 'terrain'" class="tile-grid">
        <li>
          <EditorTile
            :terrain="['/sprites/editor-tools.png', 0, 0]"
            :size="16"
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
      <ul v-if="store.selectedType === 'environment'" class="tile-grid">
        <li>
          <EditorTile
            :terrain="['/sprites/editor-tools.png', 16, 0]"
            :size="16"
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
      <ul v-if="store.selectedType === 'organism'" class="tile-grid">
        <li>
          <EditorTile
            :terrain="['/sprites/editor-tools.png', 16, 0]"
            :size="16"
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
      <ul v-if="store.selectedType === 'interaction'" class="tile-grid">
        <li>
          <EditorTile
            :terrain="['/sprites/editor-tools.png', 16, 0]"
            :size="16"
            :selected="store.selectedItem === null"
            @click="store.selectedItem = null"
          />
        </li>
        <li>
          <EditorTile
            :terrain="['/sprites/editor-tools.png', 32, 0]"
            :size="16"
            :selected="store.selectedItem === 1"
            @click="store.selectedItem = 1"
          />
        </li>
      </ul>
    </section>
    <section v-if="store.selectedEntity" class="section">
      <h2 class="title">Edit</h2>
      <div class="wrapper">
        <EditorInput v-model="store.selectedEntity.x" label="x" type="number" />
        <EditorInput v-model="store.selectedEntity.y" label="y" type="number" />
      </div>
      <button class="button" @click="deleteEntity">Delete</button>
    </section>
    <section v-if="store.selectedInteraction" class="section">
      <h2 class="title">Edit</h2>
      <select
        id="type"
        v-model="store.selectedInteraction.data.type"
        class="select"
        @change="changeInteractionType"
      >
        <option value="switch-map">Map switcher</option>
        <option value="dialogue">Dialogue</option>
      </select>
      <div class="wrapper">
        <EditorInput
          v-model="store.selectedInteraction.x"
          label="x"
          type="number"
        />
        <EditorInput
          v-model="store.selectedInteraction.y"
          label="y"
          type="number"
        />
      </div>
      <div class="wrapper">
        <EditorInput
          v-model="store.selectedInteraction.width"
          label="Width"
          type="number"
        />
        <EditorInput
          v-model="store.selectedInteraction.height"
          label="Height"
          type="number"
        />
      </div>
      <select
        id="prompt"
        v-model="store.selectedInteraction.data.prompt"
        class="select"
      >
        <option :value="null">No prompt</option>
        <option value="enter">Enter</option>
        <option value="talk">Talk</option>
      </select>
      <div
        v-if="store.selectedInteraction.data.type === 'switch-map'"
        class="wrapper"
      >
        <EditorInput
          v-model="store.selectedInteraction.data.map"
          label="Map"
          type="text"
          placeholder="Map filename"
        />
        <select
          id="type"
          v-model="store.selectedInteraction.data.playerDirection"
          class="select"
        >
          <option value="up">Up</option>
          <option value="down">Down</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div
        v-if="store.selectedInteraction.data.type === 'switch-map'"
        class="wrapper"
      >
        <EditorInput
          v-model="store.selectedInteraction.data.playerX"
          label="Player x"
          type="number"
        />
        <EditorInput
          v-model="store.selectedInteraction.data.playerY"
          label="Player y"
          type="number"
        />
      </div>
      <EditorInput
        v-if="store.selectedInteraction.data.type === 'dialogue'"
        v-model="store.selectedInteraction.data.id"
        label="Dialogue ID"
        type="number"
      />
      <button class="button" @click="deleteInteraction">Delete</button>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import './editor-mixins';

.toolkit {
  @include editor-box;

  position: absolute;
  inset: 1.5rem auto 1.5rem 1.5rem;
  width: 20rem;
}

.top-tag {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
  color: black;
  font-size: 0.75rem;
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50% -50%;
}

.section {
  @include editor-section;

  &.section-fill {
    height: 100%;
  }

  .title {
    @include editor-title;
  }

  .button {
    @include editor-button;
  }

  .select {
    @include editor-select;
  }

  .wrapper {
    display: flex;
    gap: 1rem;
  }

  .horizontal-scroller {
    display: flex;
    gap: 1rem;
    overflow: auto;
    width: calc(100% + 3rem);
    translate: -1.5rem;
    padding: 0 1.5rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.upload,
.download {
  @include editor-button;

  aspect-ratio: 1 / 1;

  &:is(.upload) {
    background-color: transparent;
    border: 2px dashed rgba(white, 0.1);
  }

  &:is(.download) {
    background-color: rgba(white, 0.04);
  }

  &:hover {
    background-color: rgba(white, 0.08);
  }

  &:active {
    background-color: rgba(white, 0.12);
  }
}

.tile-grid {
  flex: 1 0 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: min-content;
  gap: 1px;
  padding: 1px;
  overflow-y: auto;
}
</style>
