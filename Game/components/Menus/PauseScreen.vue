<script setup lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ref } from 'vue';
import Game from '../../Game';
import MenuButton from './MenuButton.vue';
import MenuButtonsList from './MenuButtonsList.vue';
import MenuTitle from './MenuTitle.vue';
import MenuCheck from './MenuCheck.vue';

const paused = ref(false);
const showOptions = ref(false);
const game = inject<Ref<Game>>('game');

const tooglePause = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (game?.value.paused) {
      paused.value = false;
    } else {
      paused.value = true;
    }
  }
};

watch(paused, (newPaused) => {
  if (newPaused) {
    showOptions.value = false;
    game?.value.pause();
  } else {
    game?.value.resume();
  }
});

onMounted(() => {
  window.addEventListener('keydown', tooglePause);
});

onUnmounted(() => {
  window.removeEventListener('keydown', tooglePause);
});
</script>

<template>
  <div v-if="paused" class="pause-screen">
    <article v-if="!showOptions" class="menu">
      <MenuTitle>Game paused</MenuTitle>
      <MenuButtonsList>
        <MenuButton @click="paused = false">Resume</MenuButton>
        <MenuButton @click="showOptions = true">Options</MenuButton>
        <MenuButton>Quit</MenuButton>
      </MenuButtonsList>
    </article>
    <article v-if="showOptions" class="menu">
      <MenuTitle>Options</MenuTitle>
      <MenuButtonsList>
        <MenuButton @click="showOptions = false">Back</MenuButton>
        <MenuCheck :default="true">Full screen</MenuCheck>
        <MenuCheck :default="true">Debug mode</MenuCheck>
        <MenuButton>Map editor</MenuButton>
      </MenuButtonsList>
    </article>
  </div>
</template>

<style scoped lang="scss">
.pause-screen {
  position: absolute;
  inset: 0;
  background-color: rgba(#000, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    color: white;
  }
}
</style>
