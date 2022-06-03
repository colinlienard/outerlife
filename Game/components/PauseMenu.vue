<script setup lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ref } from 'vue';
import Game from '../Game';

const open = ref(false);
const game = inject<Ref<Game>>('game');

const pause = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (game?.value.paused) {
      game.value.resume();
      open.value = false;
    } else {
      game?.value.pause();
      open.value = true;
    }
  }
};

onMounted(() => {
  window.addEventListener('keyup', pause);
});

onUnmounted(() => {
  window.removeEventListener('keyup', pause);
});
</script>

<template>
  <article v-if="open" class="pause-menu"></article>
</template>

<style scoped lang="scss">
.pause-menu {
  position: absolute;
  inset: 0;
  background-color: rgba(#000, 0.5);
}
</style>
