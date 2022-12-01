import { ref } from 'vue';
import { defineStore } from 'pinia';
import { GameMapInteraction, GameMapItemType } from '~~/game/utils';
import { Editor } from './editor';

export const useEditorStore = defineStore('editor', () => {
  const editor = ref<Editor>();
  const rows = ref(20);
  const columns = ref(20);
  const mapGrowsAfter = ref(true);
  const ratio = ref(5);
  const pan = ref({ x: 0, y: 0 });
  const mousePosition = ref({ x: 0, y: 0 });
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
    mapGrowsAfter,
    ratio,
    pan,
    mousePosition,
    showGrid,
    selectedItem,
    selectedType,
    selectedEntity,
    selectedInteraction,
  };
});
