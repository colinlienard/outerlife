<script setup lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ref } from 'vue';
import { navigateTo } from '~~/.nuxt/imports';
import Game from '../../Game';
import MenuButton from './MenuButton.vue';
import MenuButtonsList from './MenuButtonsList.vue';
import MenuTitle from './MenuTitle.vue';
import MenuCheck from './MenuCheck.vue';

const paused = ref(false);
const showOptions = ref(false);
const game = inject<Ref<Game>>('game');
const debugMode = inject<Ref<boolean>>('debugMode');

const isFullScreen = () => document.fullscreenElement !== null;

const enterFullScreen = () => document.body.requestFullscreen();

const exitFullScreen = () => document.exitFullscreen();

const setDebugMode = (state: boolean) => {
  (debugMode as Ref<boolean>).value = state;
  (game as Ref<Game>).value.debug = state;
};

const togglePause = () => {
  paused.value = !game?.value.paused;
};

watch(paused, (newPaused) => {
  if (newPaused) {
    showOptions.value = false;
    game?.value.pause();
  } else {
    game?.value.resume();
  }
});
</script>

<template>
  <div>
    <button class="button" @click="togglePause">⚙️</button>
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
          <MenuButton @click="showOptions = false">⬅️ Back</MenuButton>
          <MenuCheck
            :default="isFullScreen()"
            @check="enterFullScreen"
            @uncheck="exitFullScreen"
          >
            Full screen
          </MenuCheck>
          <MenuCheck
            :default="debugMode || false"
            @check="setDebugMode(true)"
            @uncheck="setDebugMode(false)"
          >
            Debug mode
          </MenuCheck>
          <MenuButton @click="navigateTo('/editor')">Map editor</MenuButton>
        </MenuButtonsList>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
}

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
