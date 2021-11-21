<template>
  <header class="app__header">
    <UiButton class="app__header-button" @click="handleLoadJsonClick">Load json</UiButton>
    <UiButton class="app__header-button" @click="handleLoadImagesClick">Load images</UiButton>
    <UiButton class="app__header-button" @click="handleAddNewCaseClick">Add new case</UiButton>
    <div class="app__columns-select">
      <p class="app__columns-select-title">Колонок:</p>
      <UiFAIconCircleButton
        class="app__columns-button"
        title="Add new case"
        @click="setColumnCount(1)"
      >
        1
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app__columns-button"
        title="Add new case"
        @click="setColumnCount(2)"
      >
        2
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app__columns-button"
        title="Add new case"
        @click="setColumnCount(4)"
      >
        4
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app__columns-button"
        title="Add new case"
        @click="setColumnCount(8)"
      >
        8
      </UiFAIconCircleButton>
    </div>
    <UiButton class="app__header-button app__header-button--export" @click="handleExportJsonClick">
      Export json
    </UiButton>
  </header>
  <main class="app__main">
    <draggable
      :model-value="app.caseList"
      class="app__case-list"
      tag="ul"
      item-key="id"
      :style="{ 'grid-template-columns': `repeat(${columnsCount}, 1fr)` }"
      @change="handleDraggableChange"
    >
      <template #item="{ element }">
        <li class="app__case-list-item">
          <CaseListItem :case-item="element" />
        </li>
      </template>
    </draggable>
  </main>
  <input
    ref="loadJson"
    class="visually-hidden"
    type="file"
    accept="application/JSON"
    @change="handleLoadJsonChange"
  />
  <input
    ref="loadImages"
    class="visually-hidden"
    multiple
    type="file"
    accept="image/*"
    @change="handleLoadImagesChange"
  />
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import CaseListItem from "@/components/CaseListItem.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";
import UiButton from "@/components/ui-kit/UiButton.vue";
// import { bigMock } from "@/mock/mock";

export default {
  name: "App",
  components: {
    CaseListItem,
    draggable,
    UiFAIconCircleButton,
    UiButton,
  },
  data() {
    return {
      columnsCount: 2,
    };
  },
  computed: {
    ...mapState(["app"]),
  },
  // mounted() {
  //   this.setApp(bigMock);
  // },
  methods: {
    ...mapActions(["setApp", "handleDraggableCaseListMoved", "addFileToFileMap", "addNewCase"]),

    handleLoadJsonClick() {
      this.$refs.loadJson.click();
    },

    handleLoadImagesClick() {
      this.$refs.loadImages.click();
    },

    handleLoadJsonChange() {
      const input = this.$refs.loadJson;
      const { files } = input;
      if (!files?.length) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonObj = JSON.parse(event.target.result);
        this.setApp(jsonObj);
      };

      reader.readAsText(files[0]);

      input.value = "";
    },

    handleLoadImagesChange() {
      const input = this.$refs.loadImages;
      const { files } = input;
      if (!files?.length) return;

      for (let i = 0; i < files.length; i++) {
        this.addFileToFileMap({ file: files[i] });
      }

      input.value = "";
    },

    handleExportJsonClick() {
      const dataStr = JSON.stringify(this.app);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = "data.json";
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    },

    handleDraggableChange({ moved }) {
      this.handleDraggableCaseListMoved({ ...moved, action: "move" });
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
.app__header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 8px 50px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
}
.app__main {
  display: flex;
  flex-direction: column;
  padding: 0 50px;
}

.app__header-button {
  margin-right: 16px;

  &--export {
    margin-left: auto;
    margin-right: 0;
  }
}

.app__columns-select {
  display: flex;
  align-items: center;
}
.app__columns-select-title {
  margin: 0;
  margin-right: 4px;
}
.app__columns-button {
  margin-right: 4px;
}
.app__case-list {
  display: grid;
}
.app__case-list-item {
  margin: 5px;
  margin-bottom: 8px;
}
</style>
