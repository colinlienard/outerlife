<script setup lang="ts">
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
  <div class="container">
    <slot />
    <span class="buttons">
      <button @click="decrease">{{ modelValue > min ? '⬅️' : '⬛' }}</button>
      <p>{{ modelValue }}</p>
      <button @click="increase">{{ modelValue < max ? '➡️' : '⬛' }}️</button>
    </span>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 24rem;
  padding: 1em;
  font-size: 1.2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #4e6679;
  border: 5px solid #5c8ba8;

  &:hover {
    background-color: #5c8ba8;
  }

  &:active {
    background-color: #72b6cf;
  }
}

.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
