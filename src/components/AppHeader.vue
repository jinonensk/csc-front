<template>
  <header class="app-header">
    <UiButton class="app-header__button" @click="handleLoadJsonClick">Load json</UiButton>
    <UiButton class="app-header__button" @click="handleLoadImagesClick">Load images</UiButton>
    <UiButton class="app-header__button" @click="handleAddNewCaseClick">Add new case</UiButton>
    <div class="app-header__columns-select">
      <p class="app-header__columns-select-title">Колонок:</p>
      <UiFAIconCircleButton
        class="app-header__columns-button"
        title="Add new case"
        @click="setColumnCount(1)"
      >
        1
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app-header__columns-button"
        title="Add new case"
        @click="setColumnCount(2)"
      >
        2
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app-header__columns-button"
        title="Add new case"
        @click="setColumnCount(4)"
      >
        4
      </UiFAIconCircleButton>
      <UiFAIconCircleButton
        class="app-header__columns-button"
        title="Add new case"
        @click="setColumnCount(8)"
      >
        8
      </UiFAIconCircleButton>
    </div>
    <UiButton class="app-header__button app-header__button--export" @click="handleExportJsonClick">
      Export json
    </UiButton>
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
  </header>
</template>
<script>
import { mapActions, mapState } from "vuex";

import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";
import UiButton from "@/components/ui-kit/UiButton.vue";

export default {
  name: "AppHeader",
  components: {
    UiFAIconCircleButton,
    UiButton,
  },
  emits: {
    changeColumnsCount: null,
  },
  computed: {
    ...mapState(["app"]),
  },
  methods: {
    ...mapActions(["setApp", "addFileToFileMap", "addNewCase"]),

    setColumnCount(evt) {
      this.$emit("change-columns-count", evt);
    },

    handleLoadJsonClick() {
      this.$refs.loadJson.click();
    },

    handleLoadImagesClick() {
      this.$refs.loadImages.click();
    },

    handleAddNewCaseClick() {
      this.addNewCase();
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
  },
};
</script>
<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 8px 50px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
}
.app-header__button {
  margin-right: 16px;

  &--export {
    margin-left: auto;
    margin-right: 0;
  }
}
.app-header__columns-select {
  display: flex;
  align-items: center;
}
.app-header__columns-select-title {
  margin: 0;
  margin-right: 4px;
}
.app-header__columns-button {
  margin-right: 4px;
}
</style>
