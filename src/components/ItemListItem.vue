<template>
  <div class="item-list-item">
    <ul class="item-list-item__buttons">
      <li>
        <button @click="handleImageButtonClick">Image</button>
      </li>
      <li>
        <button>Copy</button>
      </li>
      <li>
        <button>Delete</button>
      </li>
    </ul>
    <div class="item-list-item__image-wrapper">
      <template v-if="currentFile">
        <img
          :src="imageSrc"
          :alt="item.skinImg"
          width="155"
          height="100"
          class="item-list-item__image"
        />
        <button class="item-list-item__image-delete" @click="handleDeleteImage">Delete</button>
      </template>
      <button
        v-else
        class="item-list-item__image-button"
        :class="{ 'item-list-item__image-button--drag-over': isDragOver }"
        @click.stop="handleImageButtonClick"
        @dragover.prevent="handleDragover"
        @dragleave.prevent="handleDragleave"
        @drop.prevent="handleDrop"
      >
        Добавить
      </button>
    </div>
    <div class="item-list-item__container">
      <label>
        <span>Item name: </span>
        <input type="text" :value="item.itemName" @change="updateInputValue($event, 'itemName')" />
      </label>
      <label>
        <span>Skin name: </span>
        <input type="text" :value="item.skinName" @change="updateInputValue($event, 'skinName')" />
      </label>
      <label>
        <span>Price: </span>
        <input
          type="text"
          :value="item.itemPrice"
          @change="updateInputValue($event, 'itemPrice')"
        />
      </label>
      <span>
        Image name: <b>{{ item.skinImg }}</b>
      </span>
    </div>
  </div>
  <input
    ref="file"
    type="file"
    accept="image/*"
    class="visually-hidden"
    @change="handleFilesUpload"
  />
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ItemListImte",
  props: {
    item: { type: Object, required: true },
  },
  data() {
    return {
      isDragOver: false,
    };
  },
  computed: {
    ...mapState(["fileToFileNameMap"]),
    currentFile() {
      return this.fileToFileNameMap[this.item.skinImg];
    },
    imageSrc() {
      return this.currentFile ? URL.createObjectURL(this.currentFile) : this.item.skinImg;
    },
  },
  methods: {
    ...mapActions(["updateItemData", "addFileToFileMap"]),

    updateInputValue(evt, fieldName) {
      const { value } = evt.target;

      this.updateItemData({
        id: this.item.id,
        data: { key: fieldName, value },
      });
    },

    handleImageButtonClick() {
      this.$refs.file.click();
    },

    handleFilesUpload() {
      const input = this.$refs.file;
      const file = input?.files[0];
      if (!file) return;

      this.updateItemData({
        id: this.item.id,
        data: { key: "skinImg", value: file.name },
      });
      this.addFileToFileMap({ file });

      input.value = "";
    },
    handleDeleteImage() {
      this.updateItemData({
        id: this.item.id,
        data: { key: "skinImg", value: "" },
      });
    },
    handleDragover() {
      this.isDragOver = true;
    },
    handleDragleave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      this.$refs.file.files = event.dataTransfer.files;
      this.handleDragleave();
      this.handleFilesUpload();
    },
  },
};
</script>
<style lang="scss" scoped>
.item-list-item {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 5px;
  padding: 8px;
  padding-top: 24px;
  background-color: lightgreen;
  word-break: break-all;

  &:hover .item-list-item__buttons {
    pointer-events: initial;
    opacity: 1;
  }
}
.item-list-item__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // max-width: 400px;
  // width: 100%;
  flex-grow: 1;
  min-width: 250px;
  margin: 0 auto;
  padding: 8px;
  // margin-bottom: 16px;
}
.item-list-item__buttons {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;

  li {
    margin-left: 8px;
  }
}
label {
  display: flex;

  span {
    min-width: 80px;
  }
  input {
    width: 100%;
  }
}
.item-list-item__image-wrapper {
  position: relative;
  width: 100%;
  width: 155px;
  height: 100px;
  padding: 8px;
  box-sizing: content-box;
}
.item-list-item__image-button {
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
.item-list-item__image {
  // height: 100%;
  display: block;
  max-width: 100%;
  width: 100%;
  // min-height: 100%;
  // max-width: 250px;
  height: 100px;
  margin: auto;
}
.item-list-item__image-delete {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
