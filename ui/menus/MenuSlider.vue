<script setup lang="ts">
import MenuButton from './MenuButton.vue';

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  step: number;
}>();

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
</script>

<template>
  <MenuButton>
    <div class="container">
      <slot />
      <span class="buttons">
        <button @click="decrease">{{ modelValue > min ? '⬅️' : '⬛' }}</button>
        <p>{{ modelValue }}</p>
        <button @click="increase">{{ modelValue < max ? '➡️' : '⬛' }}️</button>
      </span>
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
