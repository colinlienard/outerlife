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
  background-color: #4e6679;
  border: 5px solid #5c8ba8;

  &:hover {
    background-color: #5c8ba8;
  }

  &:active {
    background-color: #72b6cf;
  }
}
</style>
