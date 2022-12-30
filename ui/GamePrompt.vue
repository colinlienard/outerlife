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
@import './game-ui-mixins';

.prompt {
  @include box;
  @include box-transition;

  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 65%;
  left: 50%;
  translate: -50%;

  .key {
    @include key;
  }

  .text {
    @include text;

    text-transform: capitalize;
  }
}
</style>
