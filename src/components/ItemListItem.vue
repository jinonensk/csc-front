<template>
  <div class="item-list-item">
    <header class="item-list-item__header">
      <h4 class="item-list-item__title">{{ item.itemName }}</h4>
      <ul class="item-list-item__buttons">
        <li>
          <UiFAIconCircleButton icon="clone" title="Copy" @click="handleCopyButtonClick" />
        </li>
        <li>
          <UiFAIconCircleButton
            icon="expand-arrows-alt"
            class="item-list-item__draggable"
            title="Grab and move"
          />
        </li>
        <li>
          <UiFAIconCircleButton icon="times" title="Delete" @click="handleDeleteButtonClick" />
        </li>
      </ul>
    </header>
    <div class="item-list-item__container">
      <UiImageDropArea
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

import UiImageDropArea from "@/components/ui-kit/UiImageDropArea.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";

export default {
  name: "ItemListImte",
  components: {
    UiImageDropArea,
    UiFAIconCircleButton,
  },
  props: {
    item: { type: Object, required: true },
  },
  emits: {
    remove: null,
    copy: null,
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
      this.$emit("copy");
    },

    async handleDeleteButtonClick() {
      this.$emit("remove");
    },
  },
};
</script>
<style lang="scss" scoped>
.item-list-item {
  padding: 8px;
  word-break: break-all;
  border-top: 1px solid rgba(128, 128, 128, 0.5);
}
.item-list-item__header {
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
  padding-bottom: 8px;
}
.item-list-item__title {
  margin-right: auto;
  word-break: break-all;
}
.item-list-item__buttons {
  display: flex;
  margin-left: auto;
  margin-bottom: 4px;

  li {
    margin-left: 8px;
  }
}
.item-list-item__draggable {
  &:hover {
    cursor: grab !important;
  }
  &:active {
    cursor: grabbing !important;
  }
}
.item-list-item__container {
  display: flex;
  flex-wrap: wrap;
}
.item-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 200px;
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
