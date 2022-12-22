<script setup lang="ts">
import { Ref } from 'vue';
import { Game } from '~~/game';
import { Settings } from '~~/game/utils';
import { AudioManager, Volumes } from '~~/game/managers';
import MenuButton from './menus/MenuButton.vue';
import MenuList from './menus/MenuList.vue';
import MenuTitle from './menus/MenuTitle.vue';
import MenuCheck from './menus/MenuCheck.vue';
import MenuContainer from './menus/MenuContainer.vue';
import MenuSlider from './menus/MenuSlider.vue';

const paused = ref(false);
const showOptions = ref(false);
const game = inject<Ref<Game>>('game');
const debugMode = inject<Ref<boolean>>('debugMode');

const volumes = ref<Volumes>({
  general: 5,
  soundEffects: 5,
  music: 5,
});

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
  ({ general, soundEffects, music }) => {
    AudioManager.updateVolumes({
      general: general / 5,
      soundEffects: soundEffects / 2,
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
        <MenuSlider v-model="volumes.general" :min="0" :max="10" :step="1">
          General sound
        </MenuSlider>
        <MenuSlider v-model="volumes.soundEffects" :min="0" :max="10" :step="1">
          Sound effects
        </MenuSlider>
        <MenuSlider v-model="volumes.music" :min="0" :max="10" :step="1">
          Music
        </MenuSlider>
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
  cursor: default;
}
</style>
