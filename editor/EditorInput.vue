<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  label: string;
  placeholder?: string;
  type: 'text' | 'number';
  id: string;
}>();

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <label :for="id" class="container">
    <p class="label">{{ label }}</p>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :minlength="type === 'text' ? 1 : undefined"
      @input="updateValue"
    />
  </label>
</template>

<style scoped lang="scss"></style>
