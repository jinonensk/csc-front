<template>
  <draggable
    :model-value="dropItem.itemList"
    group="item-list-items"
    tag="ul"
    item-key="id"
    @change="handleDraggableChange"
  >
    <template #item="{ element }">
      <li class="drop-list-item">
        List item: {{ element.id }}
        <ItemListItem :item="element" />
      </li>
    </template>
  </draggable>
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
  methods: {
    ...mapActions([
      "handleDraggableItemMoved",
      "handleDraggableItemAdded",
      "handleDraggableItemRemoved",
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
  },
};
</script>
<style lang="scss" scoped>
.drop-list-item {
  background-color: lightgreen;
}
</style>
