<template>
  <ul class="list">
    <slot />
  </ul>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
