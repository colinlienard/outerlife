<script setup lang="ts">
const count = ref<number>(0);
</script>

<template>
  <button class="button" @click="count += 1">
    {{ count }}
  </button>
</template>

<style lang="scss">
.button {
  color: blue;
}
</style>
