<template>
  <section class="container">
    <slot />
  </section>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  color: white;
  z-index: 1;
}
</style>
