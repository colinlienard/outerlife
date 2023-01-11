<script setup lang="ts">
import { Ref } from 'vue';
import { Game } from '~~/game';
import { Controller, Settings } from '~~/game/utils';
import { AudioManager, Volumes } from '~~/game/managers';
import MenuButton from './menus/MenuButton.vue';
import MenuList from './menus/MenuList.vue';
import MenuTitle from './menus/MenuTitle.vue';
import MenuCheck from './menus/MenuCheck.vue';
import MenuContainer from './menus/MenuContainer.vue';
import MenuSlider from './menus/MenuSlider.vue';
import MenuSubTitle from './menus/MenuSubTitle.vue';

const paused = ref(false);
const showOptions = ref(false);
const game = inject<Ref<Game>>('game');
const debugMode = inject<Ref<boolean>>('debugMode');

const volumes = ref<Volumes>({
  master: 5,
  effects: 5,
  music: 5,
});

const controller = new Controller();

const isFullScreen = () => document.fullscreenElement !== null;

const enterFullScreen = () => document.body.requestFullscreen();

const exitFullScreen = () => document.exitFullscreen();

const setDebugMode = (state: boolean) => {
  (debugMode as Ref<boolean>).value = state;
  Settings.debug = state;
};

const togglePause = () => {
  paused.value = !game?.value.paused;
};

onMounted(() => {
  // Pause the game when switching tab
  window.addEventListener('blur', () => {
    paused.value = true;
  });

  controller.startWatching().on(9, () => {
    paused.value = !paused.value;
  });
});

onUnmounted(() => {
  controller.stopWatching();
});

watch(paused, (newPaused) => {
  if (newPaused) {
    showOptions.value = false;
    game?.value.pause();
  } else {
    game?.value.resume();
  }
});

watch(
  volumes,
  ({ master, effects, music }) => {
    AudioManager.updateVolumes({
      master: master / 5,
      effects: effects / 2,
      music: music / 5,
    });
  },
  { deep: true }
);
</script>

<template>
  <button class="button" @click="togglePause">⚙️</button>
  <div v-if="paused" class="pause-screen">
    <button class="background" @click="paused = false" />
    <MenuContainer v-if="!showOptions">
      <MenuTitle>Game paused</MenuTitle>
      <MenuList>
        <MenuButton @click="paused = false">Resume</MenuButton>
        <MenuButton @click="showOptions = true">Options</MenuButton>
        <MenuButton @click="navigateTo('/editor')">Map editor</MenuButton>
        <MenuButton>Quit</MenuButton>
      </MenuList>
    </MenuContainer>
    <MenuContainer v-if="showOptions">
      <MenuTitle>Options</MenuTitle>
      <MenuList>
        <MenuButton @click="showOptions = false">⬅️ Back</MenuButton>
        <MenuSubTitle>Video</MenuSubTitle>
        <MenuCheck
          :default="isFullScreen()"
          @check="enterFullScreen"
          @uncheck="exitFullScreen"
        >
          Full screen
        </MenuCheck>
        <MenuSubTitle>Audio</MenuSubTitle>
        <MenuSlider v-model="volumes.master" :min="0" :max="10" :step="1">
          Master
        </MenuSlider>
        <MenuSlider v-model="volumes.effects" :min="0" :max="10" :step="1">
          Effects
        </MenuSlider>
        <MenuSlider v-model="volumes.music" :min="0" :max="10" :step="1">
          Music
        </MenuSlider>
        <MenuSubTitle>Development</MenuSubTitle>
        <MenuCheck
          :default="debugMode || false"
          @check="setDebugMode(true)"
          @uncheck="setDebugMode(false)"
        >
          Debug mode
        </MenuCheck>
      </MenuList>
    </MenuContainer>
  </div>
</template>

<style scoped lang="scss">
.button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  cursor: inherit;
}

.pause-screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: absolute;
  inset: 0;
  background-color: rgba(#000, 0.5);
  cursor: inherit;
}
</style>
