<template>
  <header>
    <input
      ref="initialFiles"
      multiple
      type="file"
      accept="image/*"
      @change="handleInitialFilesChange"
    />
    Колонок: <button @click="setColumnCount(1)">1</button>,
    <button @click="setColumnCount(2)">2</button>, <button @click="setColumnCount(4)">4</button>,
    <button @click="setColumnCount(8)">8</button>
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

import mock from "@/mock/example.json";
import { bigMock } from "@/mock/mock";

export default {
  name: "App",
  components: {
    CaseListItem,
    draggable,
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
    console.log("mock", mock);
    this.setApp(bigMock);
    console.log("this.app", this.app);
  },
  methods: {
    ...mapActions(["setApp", "handleDraggableCaseListMoved", "addFileToFileMap"]),
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
  },
};
</script>
<style lang="scss" scoped>
.case-list {
  display: grid;
}
.case-list-item {
  margin: 5px;
  margin-bottom: 8px;
}
</style>
