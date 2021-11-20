<template>
  <div class="item-list-item">
    <header class="item-list-item__header">
      <h4 class="item-list-item__title">{{ item.itemName }}</h4>
      <ul class="item-list-item__buttons">
        <li>
          <FAIconCircleButton icon="clone" title="Copy" @click="handleCopyButtonClick" />
        </li>
        <li>
          <FAIconCircleButton icon="times" title="Delete" @click="handleDeleteButtonClick" />
        </li>
      </ul>
    </header>
    <div class="item-list-item__container">
      <ImageDropArea
        :imageSrc="imageSrc"
        :imageAlt="item.skinImg"
        :is-show-image="!!currentFile"
        @delete="handleDeleteImage"
        @upload="handleFilesUpload"
      />
      <div class="item-list-item__inputs-container">
        <label>
          <span>Item name: </span>
          <input
            type="text"
            :value="item.itemName"
            @change="updateInputValue($event, 'itemName')"
          />
        </label>
        <label>
          <span>Skin name: </span>
          <input
            type="text"
            :value="item.skinName"
            @change="updateInputValue($event, 'skinName')"
          />
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
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

import ImageDropArea from "@/components/ui-kit/ImageDropArea.vue";
import FAIconCircleButton from "@/components/ui-kit/FAIconCircleButton.vue";

export default {
  name: "ItemListImte",
  components: {
    ImageDropArea,
    FAIconCircleButton,
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

    handleFilesUpload(file) {
      this.updateItemData({
        id: this.item.id,
        data: { key: "skinImg", value: file.name },
      });
      this.addFileToFileMap({ file });
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
  border-radius: 5px;
  padding: 8px;
  background-color: lightgreen;
  word-break: break-all;

  // &:hover .item-list-item__buttons {
  //   pointer-events: initial;
  //   opacity: 1;
  // }
}
.item-list-item__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 8px;
}
.item-list-item__title {
  margin-right: auto;
}
.item-list-item__buttons {
  display: flex;
  justify-content: flex-end;

  li {
    margin-left: 8px;
  }
}
.item-list-item__container {
  display: flex;
}
.item-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 250px;
  margin: 0 auto;
  padding: 8px;

  label {
    display: flex;
    margin-bottom: 4px;

    span {
      min-width: 80px;
    }
    input {
      width: 100%;
    }
  }
}
</style>
