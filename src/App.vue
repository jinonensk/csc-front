<template>
  <AppHeader class="app__header" @change-columns-count="setColumnCount" />
  <main class="app__main">
    <div class="app__content-container">
      <div class="app__content-image">
        <h3>Game Background</h3>
        <UiImageDropArea
          :imageSrc="gameBackgroundSrc"
          :is-show-image="!!gameBackgroundFile"
          :imageAlt="app.gameBackground"
          @delete="handleImageDelete"
          @upload="handleImageUpload"
        />
      </div>
      <div class="app__content-data">
        <label class="app__input-label">
          <p>Start money:</p>
          <input type="text" :value="app.startMoney" @change="handleInputChange('startMoney')" />
        </label>
        <label class="app__input-label">
          <p>Video reward:</p>
          <input
            type="text"
            :value="app.rewardedVideoReward"
            @change="handleInputChange($event, 'rewardedVideoReward')"
          />
        </label>
        <label class="app__input-label">
          <p>Clicker reward:</p>
          <input
            type="text"
            :value="app.clickerReward"
            @change="handleInputChange($event, 'clickerReward')"
          />
        </label>
        <label class="app__input-label">
          <p>Color primary:</p>
          <input
            type="color"
            :value="app.themeColors.colorPrimary"
            @change="handleColorInputChange($event, 'colorPrimary')"
          />
        </label>
        <label class="app__input-label">
          <p>Color primary dark:</p>
          <input
            type="color"
            :value="app.themeColors.colorPrimaryDark"
            @change="handleColorInputChange($event, 'colorPrimaryDark')"
          />
        </label>
        <label class="app__input-label">
          <p>Color accent:</p>
          <input
            type="color"
            :value="app.themeColors.colorAccent"
            @change="handleColorInputChange($event, 'colorAccent')"
          />
        </label>
      </div>
    </div>
    <draggable
      :model-value="app.caseList"
      class="app__case-list"
      handle=".case-list-item__draggable"
      tag="ul"
      item-key="id"
      :style="{ 'grid-template-columns': `repeat(${columnsCount}, 1fr)` }"
      @change="handleDraggableChange"
    >
      <template #item="{ element, index }">
        <li class="app__case-list-item">
          <CaseListItem
            :case-item="element"
            @remove="handleRemoveCase(index)"
            @copy="handleCopyCase(index)"
          />
        </li>
      </template>
    </draggable>
  </main>
  <UiConfirmModal ref="modal" />
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import CaseListItem from "@/components/CaseListItem.vue";
import AppHeader from "@/components/AppHeader.vue";
import UiConfirmModal from "@/components/ui-kit/UiConfirmModal.vue";
import UiImageDropArea from "@/components/ui-kit/UiImageDropArea.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    CaseListItem,
    draggable,
    UiConfirmModal,
    UiImageDropArea,
  },
  data() {
    return {
      columnsCount: 2,
    };
  },
  computed: {
    ...mapState(["app", "fileToFileNameMap"]),

    gameBackgroundFile() {
      const imageName = this.app.gameBackground;
      return this.fileToFileNameMap[imageName];
    },

    gameBackgroundSrc() {
      const file = this.gameBackgroundFile;
      return file ? URL.createObjectURL(file) : this.app.gameBackground;
    },
  },
  methods: {
    ...mapActions([
      "handleDraggableCaseListMoved",
      "deleteCase",
      "copyCase",
      "addFileToFileMap",
      "updateAppData",
      "updateAppColor",
    ]),

    handleInputChange(evt, fieldName) {
      const { value } = evt.target;
      this.updateAppData({ key: fieldName, value });
    },

    handleColorInputChange(evt, fieldName) {
      const { value } = evt.target;
      this.updateAppColor({ key: fieldName, value });
    },

    handleDraggableChange({ moved }) {
      this.handleDraggableCaseListMoved({ ...moved, action: "move" });
    },

    setColumnCount(count) {
      this.columnsCount = count;
    },

    handleImageUpload(file) {
      this.updateAppData({ key: "gameBackground", value: file.name });
      this.addFileToFileMap({ file });
    },

    handleImageDelete() {
      this.updateAppData({ key: "gameBackground", value: "" });
    },

    async handleRemoveCase(caseIdx) {
      const { caseName } = this.app.caseList[caseIdx];
      const title = `Remove ${caseName ? `"${caseName}" ` : ""}case?`;
      const res = await this.$refs.modal.open({ title });
      if (res) this.deleteCase({ caseIdx });
    },

    handleCopyCase(caseIdx) {
      this.copyCase({ caseIdx });
    },
  },
};
</script>
<style lang="scss" scoped>
.app__header {
  margin-bottom: 24px;
}
.app__main {
  display: flex;
  flex-direction: column;
  padding: 0 50px;
}
.app__content-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.app__content-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 200px;
  margin: 0 auto;
  padding: 8px;
}
.app__input-label {
  display: flex;
  margin-bottom: 4px;

  p {
    min-width: 135px;
  }
  input {
    width: 100%;
  }
}
.app__case-list {
  display: grid;
}
.app__case-list-item {
  margin: 5px;
  margin-bottom: 8px;
}
</style>
