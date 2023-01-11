<script setup lang="ts">
import { Controller, Settings } from '~~/game/utils';

const root = ref();
const children = ref<HTMLElement[]>([]);
const selected = ref(0);

const controller = new Controller();

const updateSelected = (value: number) => {
  if (
    (value > 0 && selected.value < children.value.length) ||
    (value < 0 && selected.value > 0)
  ) {
    selected.value += value;
  }
  children.value[selected.value].focus();
};

const clickSelected = () => {
  children.value[selected.value].click();
};

onMounted(() => {
  children.value = root.value.querySelectorAll('button');
  if (Settings.usingGamepad) {
    updateSelected(0);
  }

  controller
    .startWatching()
    .on(0, () => clickSelected())
    .on(12, () => updateSelected(-1))
    .on(13, () => updateSelected(1));
});

onUnmounted(() => {
  controller.stopWatching();
});
</script>

<template>
  <ul ref="root" class="list">
    <slot />
  </ul>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
