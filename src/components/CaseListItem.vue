<template>
  <div class="case-list-item">
    <ul class="case-list-item__buttons">
      <li>
        <button @click="handleAddClick">Add list</button>
      </li>
      <li>
        <button @click="handleCopyClick">Copy case</button>
      </li>
      <li>
        <button @click="handleDeleteClick">Delete</button>
      </li>
    </ul>
    Case list item: {{ caseItem.caseName }}
    <draggable
      v-if="isOpen"
      :model-value="caseItem.dropList"
      group="drop-list"
      tag="ul"
      item-key="id"
      @change="handleDraggableChange"
    >
      <template #item="{ element }">
        <li class="case-list-item__drop-list-item">
          <DropListItem :drop-item="element" />
        </li>
      </template>
    </draggable>
  </div>
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
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    ...mapActions([
      "handleDraggableDropListMoved",
      "handleDraggableDropListAdded",
      "handleDraggableDropListRemoved",
      "addNewDropListItemToCaseList",
      "copyCaseListItem",
      "deleteCaseListItem",
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

    handleAddClick() {
      this.addNewDropListItemToCaseList({ caseId: this.caseItem.id });
    },

    handleCopyClick() {
      this.copyCaseListItem({ caseId: this.caseItem.id });
    },
    handleDeleteClick() {
      this.deleteCaseListItem({ caseId: this.caseItem.id });
    },
  },
};
</script>
<style lang="scss" scoped>
.case-list-item {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 5px;
  background-color: lightcoral;
}
.case-list-item__buttons {
  display: flex;
  justify-content: center;

  li {
    margin-left: 8px;
  }
}
.case-list-item__drop-list-item {
  margin-bottom: 8px;
}
</style>
