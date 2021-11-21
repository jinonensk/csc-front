<template>
  <div class="drop-list-item" :style="{ border: `1px solid ${dropItem.color}` }">
    <header class="drop-list-item__header" :style="{ backgroundColor: dropItem.color }">
      <!-- <h3 class="drop-list-item__title">Drop list item</h3> -->
      <ul class="drop-list-item__buttons">
        <li>
          <FAIconCircleButton icon="plus" title="Add item" @click="handleAddItemClick" />
        </li>
        <li>
          <FAIconCircleButton icon="clone" title="Copy list" @click="handleCopyListClick" />
        </li>
        <li>
          <FAIconCircleButton
            :icon="isOpen ? 'angle-down' : 'angle-up'"
            :title="isOpen ? 'Collapse' : 'Open'"
            @click.stop="isOpen = !isOpen"
          />
        </li>
        <li>
          <FAIconCircleButton icon="times" title="Delete" @click="handleDeleteListClick" />
        </li>
      </ul>
    </header>
    <div v-if="isOpen" class="drop-list-item__content">
      <div class="drop-list-item__inputs-container">
        <label>
          <p>Drop rate:</p>
          <input type="text" :value="dropItem.rate" @change="handleInputChange($event, 'rate')" />
        </label>
        <label>
          <p>Drop color:</p>
          <input
            type="color"
            :value="dropItem.color"
            @change="handleInputChange($event, 'color')"
          />
        </label>
      </div>
      <draggable
        :model-value="dropItem.itemList"
        group="item-list-items"
        tag="ul"
        item-key="id"
        @change="handleDraggableChange"
      >
        <template #item="{ element }">
          <li class="drop-list-item__item-list-item">
            <ItemListItem :item="element" />
          </li>
        </template>
        <!-- <template #footer> </template> -->
      </draggable>
      <DropAreaWrapper @drop-files="handleDrop">
        <template v-slot:default="{ isDragOver }">
          <div
            class="drop-list-item__load-area"
            :class="{ 'drop-list-item__load-area--drag-over': isDragOver }"
            @click="handleDropZoneClick"
          >
            <h2>Click or drop images</h2>
          </div>
        </template>
      </DropAreaWrapper>
    </div>
  </div>
  <input
    ref="files"
    type="file"
    accept="image/*"
    multiple
    class="visually-hidden"
    @change="handleFilesUpload"
  />
</template>
<script>
import { mapActions } from "vuex";
import draggable from "vuedraggable";

import ItemListItem from "@/components/ItemListItem.vue";
import DropAreaWrapper from "@/components/ui-kit/DropAreaWrapper.vue";
import FAIconCircleButton from "@/components/ui-kit/FAIconCircleButton.vue";

export default {
  name: "DropListItem",
  components: {
    draggable,
    ItemListItem,
    DropAreaWrapper,
    FAIconCircleButton,
  },
  props: {
    dropItem: { type: Object, required: true },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    ...mapActions([
      "addFileToFileMap",
      "addNewItemToDropList",
      "copyDropListItem",
      "removeDropListItem",
      "updateDropListItemData",
      "handleDragAndDropItem",
    ]),

    handleInputChange(evt, fieldName) {
      const { value } = evt.target;

      this.updateDropListItemData({
        dropId: this.dropItem.id,
        data: { key: fieldName, value },
      });
    },

    handleDraggableChange(evt) {
      const actionNameMap = {
        moved: "move",
        added: "insert",
        removed: "remove",
      };

      const action = Object.keys(evt)[0];
      const data = evt[action];

      this.handleDragAndDropItem({
        ...data,
        dropId: this.dropItem.id,
        action: actionNameMap[action],
      });
    },

    handleDropZoneClick() {
      this.$refs.files.click();
    },

    handleFilesUpload() {
      const input = this.$refs.files;
      const { files } = input;
      if (!files?.length) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.addFileToFileMap({ file });
        this.addNewItemToDropList({
          dropId: this.dropItem.id,
          initialItemData: {
            itemName: file.name,
            skinName: file.name,
            skinImg: file.name,
          },
        });
      }

      input.value = "";
    },

    handleDrop(files) {
      this.$refs.files.files = files;
      this.handleFilesUpload();
    },

    handleAddItemClick() {
      this.isOpen = true;
      this.addNewItemToDropList({ dropId: this.dropItem.id });
    },

    handleCopyListClick() {
      this.copyDropListItem({ dropId: this.dropItem.id });
    },

    handleDeleteListClick() {
      this.removeDropListItem({ dropId: this.dropItem.id });
    },
  },
};
</script>
<style lang="scss" scoped>
.drop-list-item {
  border-radius: 5px;
  cursor: grab;
  background-color: #ffffff;

  // &:hover .drop-list-item__buttons {
  //   opacity: 1;
  //   pointer-events: initial;
  // }
}
.drop-list-item__header {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
}
.drop-list-item__title {
  margin-right: auto;
  word-break: break-all;
}
.drop-list-item__buttons {
  display: flex;
  margin-left: auto;
  margin-bottom: 4px;
  // justify-content: flex-end;
  // opacity: 0;
  // pointer-events: none;

  li {
    margin-left: 8px;
  }
}
.drop-list-item__content {
  padding: 0 8px 8px 8px;
}
.drop-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin: 0 auto;
  margin-bottom: 16px;
  padding: 8px;

  label {
    display: flex;
    margin-bottom: 4px;

    p {
      min-width: 80px;
    }
    input {
      width: 100%;
    }
  }
}
.drop-list-item__item-list-item {
  margin-bottom: 8px;

  &:last-child {
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    margin-bottom: 16px;
  }
}
.drop-list-item__load-area {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border: 1px dashed gray;
  border-radius: 15px;

  &--drag-over,
  &:hover {
    cursor: pointer;
    background-color: rgba(128, 128, 128, 0.1);
  }
}
</style>
