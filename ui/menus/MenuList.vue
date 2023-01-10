<script setup lang="ts">
import { Controller } from '~~/game/utils';

const root = ref();
const children = ref<HTMLElement[]>([]);
const selected = ref(0);

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
  updateSelected(0);

  setTimeout(() => {
    Controller.on(0, () => clickSelected());
    Controller.on(12, () => updateSelected(-1));
    Controller.on(13, () => updateSelected(1));
  }, 100);
});

onUnmounted(() => {
  Controller.unbind(0);
  Controller.unbind(12);
  Controller.unbind(13);
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
