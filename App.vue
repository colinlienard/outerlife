<script setup lang="ts">
import GameCanvas from './Game/GameCanvas.vue';
import ImageLoaderCanvas from './Game/ImageLoaderCanvas.vue';
</script>

<template>
  <main>
    <GameCanvas></GameCanvas>
    <ImageLoaderCanvas></ImageLoaderCanvas>
  </main>
</template>

<style lang="scss">
/* stylelint-disable-next-line selector-id-pattern */
#__nuxt {
  font-size: 0;
}
</style>
