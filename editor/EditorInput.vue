<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number | boolean;
  label: string;
  placeholder?: string;
  type: 'text' | 'number' | 'checkbox';
}>();

const width = ref(1);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void;
  (e: 'change', event: Event): void;
}>();

const updateValue = (event: Event) => {
  emit('change', event);

  const target = event.target as HTMLInputElement;

  if (props.type === 'checkbox') {
    emit('update:modelValue', target.checked);
    return;
  }

  if (props.type === 'text') {
    emit('update:modelValue', target.value);
    return;
  }

  emit('update:modelValue', parseInt(target.value, 10));
};

const updateWidth = () => {
  if (props.type === 'checkbox') {
    return;
  }

  width.value = `${props.modelValue}`.length;
};

onMounted(() => updateWidth());

watch(
  () => props.modelValue,
  () => updateWidth()
);
</script>

<template>
  <label :for="label" :class="['label', { check: type === 'checkbox' }]">
    <p v-if="type === 'checkbox'" class="text opaque">{{ label }}</p>
    <p v-else class="text">{{ label }}:</p>
    <input
      :id="label"
      :class="['input', { hidden: type === 'checkbox', fill: type === 'text' }]"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :checked="type === 'checkbox' ? modelValue as boolean : undefined"
      @input="updateValue"
    />
  </label>
</template>

<style scoped lang="scss">
@import './editor-mixins';

.label {
  @include editor-button(false);

  &.check {
    @include editor-button(true);
  }

  .text:not(.text.opaque) {
    opacity: 0.5;
  }

  .input {
    width: calc(v-bind(width) * 1ch + 1rem);

    &.hidden {
      display: none;
    }

    &.fill {
      width: 100%;
      padding-left: 1ch;
    }
  }
}
</style>
