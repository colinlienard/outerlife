<script setup lang="ts">
import { Settings } from '~~/game/utils';

defineProps<{
  controllerButton: string;
}>();

const { usingGamepad } = Settings;
</script>

<template>
  <span :class="['key', { round: usingGamepad }]">{{
    usingGamepad ? controllerButton : 'e'
  }}</span>
</template>

<style scoped lang="scss">
.key {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #b6f5db;
  border: solid 0.2rem currentcolor;
  box-shadow: 0 0 1rem #72b6cf, inset 0 0 1rem #72b6cf;
  transition: opacity 0.2s ease-in-out;

  &.round {
    border-radius: 50%;
  }
}
</style>
