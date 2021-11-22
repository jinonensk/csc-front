<template>
  <div class="case-list-item">
    <header class="case-list-item__header">
      <h2 class="case-list-item__title">{{ caseItem.caseName }}</h2>
      <ul class="case-list-item__buttons">
        <li>
          <UiFAIconCircleButton icon="plus" title="Add list" @click="handleAddClick" />
        </li>
        <li>
          <UiFAIconCircleButton icon="clone" title="Copy case" @click="handleCopyClick" />
        </li>
        <li>
          <UiFAIconCircleButton
            :icon="isOpen ? 'angle-up' : 'angle-down'"
            :title="isOpen ? 'Collapse' : 'Open'"
            @click.stop="isOpen = !isOpen"
          />
        </li>
        <li>
          <UiFAIconCircleButton
            icon="expand-arrows-alt"
            class="case-list-item__draggable"
            title="Grab and move"
          />
        </li>
        <li>
          <UiFAIconCircleButton icon="times" title="Delete" @click="handleDeleteClick" />
        </li>
      </ul>
    </header>
    <template v-if="isOpen">
      <div class="case-list-item__inputs-container">
        <label>
          <p>Case name:</p>
          <input
            type="text"
            :value="caseItem.caseName"
            @change="handleInputChange($event, 'caseName')"
          />
        </label>
        <label>
          <p>Case price:</p>
          <input
            type="text"
            :value="caseItem.casePrice"
            @change="handleInputChange($event, 'casePrice')"
          />
        </label>
      </div>
      <ul class="case-list-item__images-list">
        <li class="case-list-item__images-item">
          <h3>Case Image</h3>
          <UiImageDropArea
            :imageSrc="getImageSrc('caseImg')"
            :is-show-image="!!getCurrentFile('caseImg')"
            :imageAlt="caseItem.caseImg"
            @delete="handleImageDelete('caseImg')"
            @upload="handleImageUpload($event, 'caseImg')"
          />
        </li>
        <li class="case-list-item__images-item">
          <h3>Case spin background</h3>
          <UiImageDropArea
            :imageSrc="getImageSrc('caseSpinBackground')"
            :is-show-image="!!getCurrentFile('caseSpinBackground')"
            :imageAlt="caseItem.caseSpinBackground"
            @delete="handleImageDelete('caseSpinBackground')"
            @upload="handleImageUpload($event, 'caseSpinBackground')"
          />
        </li>
      </ul>
      <p
        class="case-list-item__rate"
        :class="{ 'case-list-item__rate--error': +totalDropListItemsRate !== 100 }"
      >
        Total drop list items rate: {{ totalDropListItemsRate }}%
      </p>
      <draggable
        :model-value="caseItem.dropList"
        group="drop-list"
        handle=".drop-list-item__draggable"
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
    </template>
  </div>
  <UiConfirmModal ref="modal" />
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import DropListItem from "@/components/DropListItem.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";
import UiImageDropArea from "@/components/ui-kit/UiImageDropArea.vue";
import UiConfirmModal from "@/components/ui-kit/UiConfirmModal.vue";

export default {
  name: "CaseListItem",
  props: {
    caseItem: { type: Object, required: true },
  },
  components: {
    DropListItem,
    UiFAIconCircleButton,
    UiImageDropArea,
    UiConfirmModal,
    draggable,
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    ...mapState(["fileToFileNameMap"]),
    totalDropListItemsRate() {
      return this.caseItem.dropList.reduce((acc, item) => acc + item.rate / 100, 0);
    },
  },
  methods: {
    ...mapActions([
      "addNewDropListItemToCaseList",
      "copyCaseListItem",
      "deleteCaseListItem",
      "updateCaseData",
      "addFileToFileMap",
      "handleDragAndDropDropList",
    ]),

    handleInputChange(evt, fieldName) {
      const { value } = evt.target;

      this.updateCaseData({
        caseId: this.caseItem.id,
        data: { key: fieldName, value },
      });
    },

    handleImageUpload(file, fieldName) {
      this.updateCaseData({
        caseId: this.caseItem.id,
        data: { key: fieldName, value: file.name },
      });
      this.addFileToFileMap({ file });
    },

    handleImageDelete(fieldName) {
      this.updateCaseData({
        caseId: this.caseItem.id,
        data: { key: fieldName, value: "" },
      });
    },

    handleDraggableChange(evt) {
      const actionNameMap = {
        moved: "move",
        added: "insert",
        removed: "remove",
      };

      const action = Object.keys(evt)[0];
      const data = evt[action];

      this.handleDragAndDropDropList({
        ...data,
        caseId: this.caseItem.id,
        action: actionNameMap[action],
      });
    },

    handleAddClick() {
      this.addNewDropListItemToCaseList({ caseId: this.caseItem.id });
    },

    handleCopyClick() {
      this.copyCaseListItem({ caseId: this.caseItem.id });
    },

    async handleDeleteClick() {
      const { caseName } = this.caseItem;
      const title = `Remove ${caseName ? `"${caseName}" ` : ""}case?`;
      const res = await this.$refs.modal.open({ title });
      if (res) this.deleteCaseListItem({ caseId: this.caseItem.id });
    },

    handleImageButtonClick() {
      this.$refs.file.click();
    },

    getCurrentFile(fieldName) {
      const imageName = this.caseItem[fieldName];
      return this.fileToFileNameMap[imageName];
    },

    getImageSrc(fieldName) {
      const file = this.getCurrentFile(fieldName);
      return file ? URL.createObjectURL(file) : this.caseItem[fieldName];
    },
  },
};
</script>
<style lang="scss" scoped>
.case-list-item {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.02);
  box-shadow: rgb(9 30 66 / 25%) 0px 4px 8px -2px, rgb(9 30 66 / 8%) 0px 0px 0px 1px;
}
.case-list-item__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap-reverse;
  padding-bottom: 8px;
}
.case-list-item__title {
  margin-right: auto;
  word-break: break-all;
}
.case-list-item__buttons {
  display: flex;
  margin-left: auto;
  margin-bottom: 4px;

  li {
    margin-left: 8px;
  }
}
.case-list-item__draggable {
  &:hover {
    cursor: grab !important;
  }
  &:active {
    cursor: grabbing !important;
  }
}
.case-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin: 0 auto;
  padding: 8px;

  label {
    display: flex;
    margin-bottom: 4px;

    p {
      min-width: 80px;
    }
    input {
      width: 100%;
    }
  }
}
.case-list-item__images-list {
  display: flex;
  flex-wrap: wrap;
}
.case-list-item__images-item {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.case-list-item__rate {
  margin-bottom: 16px;
  padding: 5px;

  &--error {
    background-color: red;
  }
}
.case-list-item__drop-list-item {
  margin-bottom: 8px;
}
</style>
