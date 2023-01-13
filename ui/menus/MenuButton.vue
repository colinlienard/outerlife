<script setup lang="ts">
import { AudioManager } from '~~/game/managers';

const element = ref(null);

defineExpose({ element });

const playSound = (sound: string) => {
  AudioManager.playEffect(`/sounds/ui/${sound}.wav`, { pitchVariance: 200 });
};
</script>

<template>
  <li>
    <button
      ref="element"
      class="button"
      @click="playSound('click')"
      @mouseenter="playSound('hover')"
      @focus="playSound('hover')"
    >
      <slot />
    </button>
  </li>
</template>

<style scoped lang="scss">
.button {
  width: 24rem;
  padding: 1em;
  font-size: 1.2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4e6679;
  border: 5px solid #5c8ba8;
  cursor: inherit;

  &:hover,
  &:focus {
    background-color: #5c8ba8;
  }

  &:active {
    background-color: #72b6cf;
  }
}
</style>
