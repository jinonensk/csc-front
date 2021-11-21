<template>
  <button class="ui-button">
    <slot />
  </button>
</template>
<style lang="scss" scoped>
.ui-button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  padding: 3px 6px;
  background: #ffffff;
  border: 1px solid gray;
  color: gray;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  border-radius: 999px;

  &:hover:not(:active) {
    border: 1px solid black;
    color: black;
  }
}
</style>
