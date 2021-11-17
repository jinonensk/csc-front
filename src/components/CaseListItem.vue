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
        moved: (data) => this.handleDraggableDropListMoved({ ...data, caseId: this.caseItem.id }),
        added: (data) => this.handleDraggableDropListAdded({ ...data, caseId: this.caseItem.id }),
        removed: (data) =>
          this.handleDraggableDropListRemoved({ ...data, caseId: this.caseItem.id }),
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
