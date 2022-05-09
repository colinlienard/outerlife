<script setup lang="ts">
const { source, x, y, selected } = defineProps<{
  source: string;
  x: number;
  y: number;
  size: number;
  selected: boolean;
}>();
</script>

<template>
  <button :class="['tile', { selected: selected }]" @click="$emit('click')">
    <img class="image" :src="`/sprites/${source}.png`" alt="" />
  </button>
</template>

<style scoped lang="scss">
.tile {
  width: 48px;
  height: 48px;
  overflow: hidden;
  position: relative;

  &:hover {
    opacity: 0.8;
  }

  &.selected {
    outline: 3px solid white;
    z-index: 1;
  }

  .image {
    image-rendering: pixelated;
    max-width: unset;
    transform: scale(3) translate(33.33%, 33.33%);
    position: absolute;
    top: calc(v-bind(y) / v-bind(size) * -48px);
    left: calc(v-bind(x) / v-bind(size) * -48px);
  }
}
</style>
