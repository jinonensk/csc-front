<template>
  <div class="drop-list-item">
    <ul class="drop-list-item__buttons">
      <li>
        <button>Add item</button>
      </li>
      <li>
        <button>Copy list</button>
      </li>
      <li>
        <button @click.stop="isOpen = !isOpen">
          {{ isOpen ? "Collapse" : "Open" }}
        </button>
      </li>
      <li>
        <button>Delete</button>
      </li>
    </ul>
    Drop list item: {{ dropItem.id }}
    <draggable
      v-if="isOpen"
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
        <div
          class="drop-list-item__load-area"
          :class="{ 'drop-list-item__load-area--drag-over': isDragOver }"
          @click="handleDropZoneClick"
          @dragover.prevent="handleDragover"
          @dragleave.prevent="handleDragleave"
          @drop.prevent="handleDrop"
        >
          <h2>ДОБАВИТЬ</h2>
        </div>
      </template>
    </draggable>
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

export default {
  name: "DropListItem",
  components: {
    draggable,
    ItemListItem,
  },
  props: {
    dropItem: { type: Object, required: true },
  },
  data() {
    return {
      isOpen: false,
      isDragOver: false,
    };
  },
  methods: {
    ...mapActions([
      "handleDraggableItemMoved",
      "handleDraggableItemAdded",
      "handleDraggableItemRemoved",
      "addFileToFileMap",
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
        this.addFileToFileMap({ file: files[i] });
      }

      input.value = "";
    },
    handleDragover() {
      this.isDragOver = true;
    },
    handleDragleave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      this.$refs.files.files = event.dataTransfer.files;
      this.handleDragleave();
      this.handleFilesUpload();
    },
  },
};
</script>
<style lang="scss" scoped>
.drop-list-item {
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 5px;

  // &:hover .drop-list-item__buttons {
  //   opacity: 1;
  //   pointer-events: initial;
  // }
}
.drop-list-item__buttons {
  display: flex;
  justify-content: flex-end;

  li {
    margin-left: 8px;
  }
}
.drop-list-item__item-list-item {
  margin-bottom: 8px;
}
.drop-list-item__load-area {
  display: flex;
  justify-content: center;
  width: 100%;
  border: 1px dashed green;
  border-radius: 15px;

  &--drag-over,
  &:hover {
    cursor: pointer;
    background-color: yellow;
  }
}
</style>
