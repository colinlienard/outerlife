<script setup lang="ts">
import { Controller } from '~~/game/utils';
import MenuButton from './MenuButton.vue';

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  step: number;
}>();

const root = ref();
const isFocused = ref(false);

const controller = new Controller();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const decrease = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1);
  }
};

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1);
  }
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = root.value?.element === event.target;
};

onMounted(() => {
  window.addEventListener('focusin', handleFocus);

  controller
    .startWatching()
    .on(14, () => {
      if (isFocused.value) {
        decrease();
      }
    })
    .on(15, () => {
      if (isFocused.value) {
        increase();
      }
    });
});

onUnmounted(() => {
  window.removeEventListener('focusin', handleFocus);

  controller.stopWatching();
});
</script>

<template>
  <MenuButton ref="root">
    <div class="container">
      <slot />
      <div class="buttons">
        <span @click="decrease">{{ modelValue > min ? '⬅️' : '⬛' }}</span>
        <p>{{ modelValue }}</p>
        <span @click="increase">{{ modelValue < max ? '➡️' : '⬛' }}️</span>
      </div>
    </div>
  </MenuButton>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;

  button {
    cursor: inherit;
  }
}
</style>
