<template>
  <div
    class="drop-area-wrapper"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
    @drop.prevent="handleDrop"
  >
    <slot :isDragOver="isDragOver" />
  </div>
</template>
<script>
export default {
  name: "UiDropAreaWrapper",
  emits: {
    "drop-files": null,
  },
  data() {
    return {
      isDragOver: false,
    };
  },
  methods: {
    handleDragover() {
      this.isDragOver = true;
    },
    handleDragleave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      this.$emit("drop-files", event.dataTransfer.files);
      this.handleDragleave();
    },
  },
};
</script>
