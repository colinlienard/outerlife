<script setup lang="ts">
import { GameMapItemType } from '~~/game/utils';
import { useEditorStore } from './editor-store';

defineProps<{
  type: GameMapItemType;
}>();

const store = useEditorStore();
</script>

<template>
  <button
    :class="['selector', { selected: store.selectedType === type }]"
    @click="store.selectedType = type"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@import './editor-mixins';

.selector {
  @include editor-button(true);

  &.selected {
    background-color: white;
    color: black;
  }
}
</style>
