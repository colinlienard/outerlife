<script setup lang="ts">
import { useEditorStore } from './editor-store';

const store = useEditorStore();

const downloadMap = () => {
  const map = store.editor?.getMap();
  useDownload(map, 'map.json');
};

watch(
  () => store.postProcessing,
  () => {
    store.editor?.updatePostProcessing(store.postProcessing);
  }
);
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
  width: 20rem;
}

.section {
  @include editor-section;

  .title {
    @include editor-title;
  }

  .button {
    @include editor-button(true);
  }

  .select {
    @include editor-button(true);

    option {
      background-color: black;
    }
  }

  .wrapper {
    display: flex;
    gap: 1rem;
  }
}
</style>
