<script setup lang="ts">
import MenuButton from './MenuButton.vue';

const props = defineProps<{
  default: boolean;
}>();
const emit = defineEmits(['check', 'uncheck']);

const checked = ref(props.default);

watch(checked, (newChecked) => {
  emit(newChecked ? 'check' : 'uncheck');
});
</script>

<template>
  <li>
    <MenuButton @click="checked = !checked">
      <span class="checkbox">{{ checked ? '✅' : '⬛' }}</span>
      <slot />
    </MenuButton>
  </li>
</template>

<style scoped lang="scss">
.checkbox {
  position: absolute;
  left: 2rem;
}
</style>
