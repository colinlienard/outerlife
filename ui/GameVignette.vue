<template>
  <div class="vignette" />
</template>

<style scoped lang="scss">
.vignette {
  position: absolute;
  width: 121%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  box-shadow: inset 0 0 16rem black;
  opacity: 0.5;
  pointer-events: none;
}
</style>
