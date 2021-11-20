<template>
  <DropAreaWrapper @drop-files="handleDrop">
    <template v-slot:default="{ isDragOver }">
      <div class="image-drop-area">
        <template v-if="isShowImage">
          <img
            :src="imageSrc"
            :alt="imageAlt"
            width="155"
            height="100"
            class="image-drop-area__image"
            loading="lazy"
          />
          <button class="image-drop-area__image-delete" @click="handleDeleteImage">Delete</button>
        </template>
        <button
          v-else
          class="image-drop-area__image-button"
          :class="{ 'image-drop-area__image-button--drag-over': isDragOver }"
          @click.stop="handleImageButtonClick"
        >
          Добавить
        </button>
      </div>
    </template>
  </DropAreaWrapper>
  <input
    ref="file"
    type="file"
    accept="image/*"
    class="visually-hidden"
    @change="handleFilesUpload"
  />
</template>

<script>
import DropAreaWrapper from "@/components/ui-kit/DropAreaWrapper.vue";

export default {
  name: "ImageDropArea",
  emits: {
    delete: null,
    upload: null,
  },
  props: {
    imageSrc: { type: String, required: true },
    imageAlt: { type: String, required: true },
    isShowImage: { type: Boolean, required: true },
  },
  components: {
    DropAreaWrapper,
  },
  methods: {
    handleDeleteImage() {
      this.$emit("delete");
    },
    handleDrop(files) {
      const file = files[0];
      if (!file) return;
      this.$emit("upload", file);
    },
    handleImageButtonClick() {
      this.$refs.file.click();
    },
    handleFilesUpload() {
      const input = this.$refs.file;
      const file = input?.files[0];
      if (!file) return;
      this.$emit("upload", file);
      input.value = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.image-drop-area {
  position: relative;
  width: 100%;
  width: 155px;
  height: 100px;
  padding: 8px;
  box-sizing: content-box;
}
.image-drop-area__image-button {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
  border: 1px dashed gray;
  border-radius: 5px;
  overflow: hidden;

  &--drag-over,
  &:hover {
    cursor: pointer;
    background: yellow;
  }
}
.image-drop-area__image {
  display: block;
  max-width: 100%;
  width: 100%;
  height: 100px;
  margin: auto;
}
.image-drop-area__image-delete {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
