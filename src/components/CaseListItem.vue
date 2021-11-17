<template>
  <draggable
    :model-value="caseItem.dropList"
    group="drop-list"
    tag="ul"
    item-key="id"
    @change="handleDraggableChange"
  >
    <template #item="{ element }">
      <li class="case-list-item">
        Drop list item: {{ element.id }}
        <DropListItem :drop-item="element" />
      </li>
    </template>
  </draggable>
  <!-- <li class="drop-list-item">
        List item: {{ element.id }}
        <ItemListItem :item="element" />
      </li> -->

  <!-- <ul>
    <li v-for="(dropItem, i) in caseItem.dropList" class="case-list-item" :key="dropItem.id">
      Drop list item: {{ i }}
      <DropListItem :drop-item="dropItem" />
    </li>
  </ul> -->
</template>
<script>
import { mapActions } from "vuex";
import draggable from "vuedraggable";

import DropListItem from "@/components/DropListItem.vue";

export default {
  name: "CaseListItem",
  props: {
    caseItem: { type: Object, required: true },
  },
  components: {
    DropListItem,
    draggable,
  },
  methods: {
    ...mapActions([
      "handleDraggableDropListMoved",
      "handleDraggableDropListAdded",
      "handleDraggableDropListRemoved",
    ]),
    handleDraggableChange(evt) {
      const handlersMap = {
        moved: this.handleDraggableDropListMoved,
        added: ({ element, newIndex }) =>
          this.handleDraggableDropListAdded({ element, newIndex, caseId: this.caseItem.id }),
        removed: ({ element, oldIndex }) =>
          this.handleDraggableDropListRemoved({ element, oldIndex, caseId: this.caseItem.id }),
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
.case-list-item {
  background-color: lightskyblue;
}
</style>
