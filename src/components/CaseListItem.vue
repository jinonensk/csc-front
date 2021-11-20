<template>
  <div class="case-list-item">
    <header class="case-list-item__header">
      <h2 class="case-list-item__title">{{ caseItem.caseName }}</h2>
      <ul class="case-list-item__buttons">
        <li>
          <FAIconCircleButton icon="plus" title="Add list" @click="handleAddClick" />
        </li>
        <li>
          <FAIconCircleButton icon="clone" title="Copy case" @click="handleCopyClick" />
        </li>
        <li>
          <FAIconCircleButton
            :icon="isOpen ? 'angle-down' : 'angle-up'"
            :title="isOpen ? 'Collapse' : 'Open'"
            @click.stop="isOpen = !isOpen"
          />
        </li>
        <li>
          <FAIconCircleButton icon="times" title="Delete" @click="handleDeleteClick" />
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
            @change="updateInputValue($event, 'caseName')"
          />
        </label>
        <label>
          <p>Case price:</p>
          <input
            type="text"
            :value="caseItem.casePrice"
            @change="updateInputValue($event, 'casePrice')"
          />
        </label>
      </div>
      <ul class="case-list-item__images-list">
        <li class="case-list-item__images-item">
          <h3>Case Image</h3>
          <ImageDropArea
            :imageSrc="null"
            :is-show-image="null"
            :imageAlt="null"
            @delete="handleImageDelete('caseImage')"
            @upload="handleImageUpload($event, 'caseImage')"
          />
        </li>
        <li class="case-list-item__images-item">
          <h3>Case spin background</h3>
          <ImageDropArea
            :imageSrc="null"
            :is-show-image="null"
            :imageAlt="null"
            @delete="handleImageDelete('caseImage')"
            @upload="handleImageUpload($event, 'caseImage')"
          />
        </li>
      </ul>
      <draggable
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
    </template>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import draggable from "vuedraggable";

import DropListItem from "@/components/DropListItem.vue";
import FAIconCircleButton from "@/components/ui-kit/FAIconCircleButton.vue";
import ImageDropArea from "@/components/ui-kit/ImageDropArea.vue";

export default {
  name: "CaseListItem",
  props: {
    caseItem: { type: Object, required: true },
  },
  components: {
    DropListItem,
    FAIconCircleButton,
    ImageDropArea,
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

    handleImageButtonClick() {
      this.$refs.file.click();
    },
    handleImageUpload(file, fieldName) {
      console.log(fieldName);
      // this.updateItemData({
      //   id: this.item.id,
      //   data: { key: fieldName, value: file.name },
      // });
      this.addFileToFileMap({ file });
    },
    handleImageDelete(fieldName) {
      console.log(fieldName);
      // this.updateItemData({
      //   id: this.item.id,
      //   data: { key: fieldName, value: "" },
      // });
    },
    updateInputValue(evt, fieldName) {
      const { value } = evt.target;
      console.log(value, fieldName);
      // this.updateItemData({
      //   id: this.item.id,
      //   data: { key: fieldName, value },
      // });
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

  // &:hover .case-list-item__buttons {
  //   opacity: 1;
  //   pointer-events: initial;
  // }
}
.case-list-item__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 8px;
}
.case-list-item__title {
  margin-right: auto;
}
.case-list-item__buttons {
  display: flex;
  margin-left: auto;
  // pointer-events: none;
  // opacity: 0;

  li {
    margin-left: 8px;
  }
}
.case-list-item__inputs-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 250px;
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
  margin-bottom: 16px;
}
.case-list-item__images-item {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.case-list-item__drop-list-item {
  margin-bottom: 8px;
}
</style>
