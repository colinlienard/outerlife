<script setup lang="ts">
import { useEditorStore } from './editor-store';
import EditorInput from './EditorInput.vue';

const store = useEditorStore();

const downloadMap = () => {
  store.editor?.updatePostProcessing(store.postProcessing);
  store.editor?.updateAmbiantAudio(store.ambiantAudio);
  const map = store.editor?.getMap();
  useDownload(map, 'map.json');
};
</script>

<template>
  <div class="closer" @click="store.showPopup = false" />
  <div class="popup">
    <section class="section">
      <h2 class="title">Post processing effects</h2>
      <select
        id="post-processing"
        v-model="store.postProcessing"
        class="select"
      >
        <option :value="null">None</option>
        <option value="desert">Desert</option>
      </select>
    </section>
    <section class="section">
      <h2 class="title">Ambiant audio</h2>
      <div
        v-for="(audio, index) of store.ambiantAudio"
        :key="index"
        class="wrapper-2-1"
      >
        <EditorInput
          v-model="store.ambiantAudio[index]"
          label="Path"
          placeholder="Audio source"
          type="text"
        />
        <button class="button" @click="store.ambiantAudio.splice(index, 1)">
          Delete
        </button>
      </div>
      <button class="button" @click="store.ambiantAudio.push('/sounds/*.wav')">
        Add
      </button>
    </section>
    <section class="section">
      <button class="button" @click="downloadMap">Export</button>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import './editor-mixins';

.closer {
  position: absolute;
  inset: 0;
  cursor: not-allowed;
}

.popup {
  @include editor-box;

  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 30rem;
}

.section {
  @include editor-section;

  .title {
    @include editor-title;
  }

  .button {
    @include editor-button;
  }

  .select {
    @include editor-select;
  }

  .wrapper-2-1 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
}
</style>
