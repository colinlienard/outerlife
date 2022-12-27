<script setup lang="ts">
import { EventManager } from '~~/game/managers';
import { GamePrompt } from '~~/game/utils';

const promptText = ref<GamePrompt>(null);

EventManager.on('show-prompt', (prompt) => {
  promptText.value = prompt;
});

EventManager.on('hide-prompt', () => {
  promptText.value = null;
});
</script>

<template>
  <Transition>
    <div v-if="promptText" class="prompt">
      <span class="key">e</span>
      <p class="text">
        {{ promptText }}
      </p>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.prompt {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 65%;
  left: 50%;
  translate: -50%;
  background-color: rgba(black, 40%);
  padding: 1rem;
  backdrop-filter: blur(1rem);

  &.v-enter-active,
  &.v-leave-active {
    transition: 0.1s ease-out;
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
    transform: translateY(1rem);
    transition: 0.1s ease-in;
  }

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
    border: solid 3px currentcolor;
    box-shadow: 0 0 1rem #72b6cf, inset 0 0 1rem #72b6cf;
  }

  .text {
    font-size: 1.5rem;
    font-weight: 500;
    text-transform: capitalize;
    color: white;
  }
}
</style>
