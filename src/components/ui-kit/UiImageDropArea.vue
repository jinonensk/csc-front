<template>
  <UiDropAreaWrapper @drop-files="handleDrop">
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
          <UiFAIconCircleButton
            class="image-drop-area__image-delete"
            icon="times"
            title="Delete"
            @click="handleDeleteImage"
          />
        </template>
        <button
          v-else
          class="image-drop-area__image-button"
          :class="{ 'image-drop-area__image-button--drag-over': isDragOver }"
          @click.stop="handleImageButtonClick"
        >
          Click or drop images
        </button>
      </div>
    </template>
  </UiDropAreaWrapper>
  <input
    ref="file"
    type="file"
    accept="image/*"
    class="visually-hidden"
    @change="handleFilesUpload"
  />
</template>

<script>
import UiDropAreaWrapper from "@/components/ui-kit/UiDropAreaWrapper.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";

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
    UiDropAreaWrapper,
    UiFAIconCircleButton,
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
    background: rgba(128, 128, 128, 0.1);
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
