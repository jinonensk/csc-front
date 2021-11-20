<template>
  <button class="fa-icon-cirle-button" :title="title" :aria-label="title">
    <slot>
      <font-awesome-icon class="fa-icon-cirle-button__icon" :icon="icon" />
    </slot>
  </button>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "FAIconCircleButton",
  components: {
    FontAwesomeIcon,
  },
  props: {
    icon: { type: String, default: "" },
    title: { type: String, required: true },
  },
};
</script>
<style lang="scss" scoped>
.fa-icon-cirle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
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
.fa-icon-cirle-button__icon {
  width: 16px;
  height: 16px;
  margin: auto;
}
</style>
