import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Editor } from './editor';
import { GameMapInteraction, GameMapItemType } from '~~/game/utils';

export const useEditorStore = defineStore('editor', () => {
  const editor = ref<Editor>();
  const rows = ref(20);
  const columns = ref(20);
  const addSizeAfter = ref(true);
  const ratio = ref(5);
  const pan = ref({ x: 0, y: 0 });
  const showGrid = ref(true);
  const selectedItem = ref<number | null>(null);
  const selectedType = ref<GameMapItemType>('terrain');
  const selectedEntity = ref<{
    x: number;
    y: number;
    index: number;
  } | null>(null);
  const selectedInteraction = ref<
    | (GameMapInteraction & {
        index: number;
      })
    | null
  >(null);

  return {
    editor,
    rows,
    columns,
    addSizeAfter,
    ratio,
    pan,
    showGrid,
    selectedItem,
    selectedType,
    selectedEntity,
    selectedInteraction,
  };
});
