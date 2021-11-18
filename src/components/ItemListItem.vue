<template>
  <div class="item-list-item">
    <ul class="item-list-item__buttons">
      <li>
        <button @click="handleImageButtonClick">Image</button>
      </li>
      <li>
        <button @click="handleCopyButtonClick">Copy</button>
      </li>
      <li>
        <button @click="handleDeleteButtonClick">Delete</button>
      </li>
    </ul>
    <ImageDropArea
      :imageSrc="imageSrc"
      :imageAlt="item.skinImg"
      :is-show-image="!!currentFile"
      @delete="handleDeleteImage"
      @drop-files="handleDrop"
      @upload-click="handleImageButtonClick"
    />
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
import ImageDropArea from "@/components/ui-kit/ImageDropArea.vue";

export default {
  name: "ItemListImte",
  components: {
    ImageDropArea,
  },
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
    ...mapActions(["updateItemData", "addFileToFileMap", "copyItem", "removeItem"]),

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

    handleDrop(files) {
      this.$refs.file.files = files;
      this.handleFilesUpload();
    },

    handleDeleteImage() {
      this.updateItemData({
        id: this.item.id,
        data: { key: "skinImg", value: "" },
      });
    },

    handleCopyButtonClick() {
      this.copyItem({ id: this.item.id });
    },

    handleDeleteButtonClick() {
      this.removeItem({ id: this.item.id });
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
  flex-grow: 1;
  min-width: 250px;
  margin: 0 auto;
  padding: 8px;
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
</style>
