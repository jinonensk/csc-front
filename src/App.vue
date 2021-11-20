<template>
  <header>
    <input
      ref="initialFiles"
      multiple
      type="file"
      accept="image/*"
      @change="handleInitialFilesChange"
    />
    <div class="app__columns-select">
      <p class="app__columns-select-title">Колонок:</p>
      <FAIconCircleButton title="Add new case" @click="setColumnCount(1)">1</FAIconCircleButton>
      <FAIconCircleButton title="Add new case" @click="setColumnCount(2)">2</FAIconCircleButton>
      <FAIconCircleButton title="Add new case" @click="setColumnCount(4)">4</FAIconCircleButton>
      <FAIconCircleButton title="Add new case" @click="setColumnCount(8)">8</FAIconCircleButton>
    </div>
    <!-- <div> -->
    <FAIconCircleButton icon="plus" title="Add new case" @click="handleAddNewCaseClick" />
    <!-- <FAIconCircleButton icon="times" title="Add new case" @click="handleAddNewCaseClick" />
      <FAIconCircleButton icon="angle-up" title="Add new case" @click="handleAddNewCaseClick" />
      <FAIconCircleButton icon="angle-down" title="Add new case" @click="handleAddNewCaseClick" />
      <FAIconCircleButton icon="clone" title="Add new case" @click="handleAddNewCaseClick" /> -->
    <!-- </div> -->
  </header>
  <draggable
    :model-value="app.caseList"
    class="case-list"
    tag="ul"
    item-key="id"
    :style="{ 'grid-template-columns': `repeat(${columnsCount}, 1fr)` }"
    @change="handleDraggableChange"
  >
    <template #item="{ element }">
      <li class="case-list-item">
        <CaseListItem :case-item="element" />
      </li>
    </template>
  </draggable>
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import CaseListItem from "@/components/CaseListItem.vue";
import FAIconCircleButton from "@/components/ui-kit/FAIconCircleButton.vue";
import { bigMock } from "@/mock/mock";

export default {
  name: "App",
  components: {
    CaseListItem,
    draggable,
    FAIconCircleButton,
  },
  data() {
    return {
      columnsCount: 1,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    this.setApp(bigMock);
  },
  methods: {
    ...mapActions(["setApp", "handleDraggableCaseListMoved", "addFileToFileMap", "addNewCase"]),
    handleInitialFilesChange() {
      const input = this.$refs.initialFiles;
      const { files } = input;
      if (!files?.length) return;

      for (let i = 0; i < files.length; i++) {
        this.addFileToFileMap({ file: files[i] });
      }

      input.value = "";
    },
    handleDraggableChange({ moved }) {
      this.handleDraggableCaseListMoved(moved);
    },
    setColumnCount(count) {
      this.columnsCount = count;
    },
    handleAddNewCaseClick() {
      this.addNewCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.app__columns-select {
  display: flex;
  align-items: center;
}
.app__columns-select-title {
  margin: 0;
  margin-right: 8px;
}
.case-list {
  display: grid;
}
.case-list-item {
  margin: 5px;
  margin-bottom: 8px;
}
</style>
