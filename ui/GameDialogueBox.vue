<script setup lang="ts">
import { DialogueManager, EventManager } from '~~/game/managers';
import { Dialogue } from '~~/game/utils';

const dialogue = ref<Dialogue | null>(null);

EventManager.on('start-dialogue', async (id) => {
  dialogue.value = await DialogueManager.start(id);
});

const endDialogue = () => {
  dialogue.value = null;
  DialogueManager.end();
};

const nextDialogue = () => {
  if (dialogue.value?.hasChoices) {
    return;
  }

  if (dialogue.value?.next) {
    dialogue.value = dialogue.value.next;
    return;
  }

  endDialogue();
};

const handleChoice = (index: number) => {
  if (!dialogue.value?.hasChoices) {
    return;
  }

  const choice = dialogue.value.choices[index];
  if (choice.next) {
    dialogue.value = choice.next;
    return;
  }

  endDialogue();
};

onMounted(() => {
  window.addEventListener('keypress', (event) => {
    if (event.key === 'e' && DialogueManager.isOpen()) {
      nextDialogue();
    }
  });
});
</script>

<template>
  <Transition>
    <div v-if="dialogue" class="dialogue-container">
      <button class="dialogue-box" @click="nextDialogue">
        <p class="text">{{ dialogue?.text }}</p>
        <span v-if="!dialogue.hasChoices" class="key">e</span>
      </button>
      <Transition>
        <div v-if="dialogue?.hasChoices" class="choices-grid">
          <button
            v-for="(choice, index) of dialogue.choices"
            :key="index"
            class="choice"
            @click="handleChoice(index)"
          >
            <p class="text">
              {{ choice.text }}
            </p>
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import './game-ui-mixins';

.dialogue-container {
  @include box-transition;

  position: absolute;
  bottom: 2rem;
  left: 50%;
  translate: -50%;
  width: 40rem;
  display: flex;
  flex-direction: column;
}

.dialogue-box {
  @include box;

  height: 20rem;
  margin-bottom: 1rem;
  cursor: inherit;

  .text {
    @include text;

    text-align: start;
  }

  .key {
    @include key;

    position: absolute;
    inset: auto 1rem 1rem auto;
  }
}

.choices-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 10rem;
  transition: 0.3s cubic-bezier(0.4, 0, 0.4, 1);

  &.v-enter-from,
  &.v-leave-to {
    height: 0;
    opacity: 0;
  }

  .choice {
    @include box;

    height: 10rem;
    cursor: inherit;

    .text {
      @include text(true);

      text-align: start;
    }

    &:hover {
      background-color: white;
      box-shadow: 0 0 1rem white;

      .text {
        color: #464969;
      }
    }
  }
}
</style>
