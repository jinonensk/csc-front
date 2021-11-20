<template>
  <div class="drop-list-item">
    <header class="drop-list-item__header">
      <h3 class="drop-list-item__title">Drop list item</h3>
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
    <template v-if="isOpen">
      <div class="drop-list-item__inputs-container">
        <label>
          <p>Drop rate:</p>
          <input type="text" :value="dropItem.rate" @change="updateInputValue($event, 'rate')" />
        </label>
        <label>
          <p>Drop color:</p>
          <input type="color" :value="dropItem.color" @change="updateInputValue($event, 'color')" />
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
        <template #footer>
          <DropAreaWrapper @drop-files="handleDrop">
            <template v-slot:default="{ isDragOver }">
              <div
                class="drop-list-item__load-area"
                :class="{ 'drop-list-item__load-area--drag-over': isDragOver }"
                @click="handleDropZoneClick"
              >
                <h2>ДОБАВИТЬ</h2>
              </div>
            </template>
          </DropAreaWrapper>
        </template>
      </draggable>
    </template>
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
      "handleDraggableItemMoved",
      "handleDraggableItemAdded",
      "handleDraggableItemRemoved",
      "addFileToFileMap",
      "addNewItemToDropList",
      "copyDropListItem",
      "removeDropListItem",
    ]),
    handleDraggableChange(evt) {
      const handlersMap = {
        moved: (data) => this.handleDraggableItemMoved({ ...data, dropId: this.dropItem.id }),
        added: (data) => this.handleDraggableItemAdded({ ...data, dropId: this.dropItem.id }),
        removed: (data) => this.handleDraggableItemRemoved({ ...data, dropId: this.dropItem.id }),
      };

      const action = Object.keys(evt)[0];
      const handler = handlersMap[action];
      if (!handler) return;

      handler(evt[action]);
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
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 5px;
  cursor: grab;

  // &:hover .drop-list-item__buttons {
  //   opacity: 1;
  //   pointer-events: initial;
  // }
}
.drop-list-item__header {
  display: flex;
  padding-bottom: 8px;
}
.drop-list-item__title {
  margin-right: auto;
}
.drop-list-item__buttons {
  display: flex;
  // justify-content: flex-end;
  // opacity: 0;
  // pointer-events: none;

  li {
    margin-left: 8px;
  }
}
.drop-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 250px;
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
}
.drop-list-item__load-area {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border: 1px dashed green;
  border-radius: 15px;

  &--drag-over,
  &:hover {
    cursor: pointer;
    background-color: yellow;
  }
}
</style>
