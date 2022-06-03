<template>
  <li>
    <button class="button">
      <slot />
    </button>
  </li>
</template>

<style scoped lang="scss">
.button {
  width: 24rem;
  padding: 1em;
  font-size: 1.2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(#000, 0.5);

  &:hover {
    background-color: rgba(#000, 0.6);
  }

  &:active {
    background-color: #000;
  }
}
</style>
