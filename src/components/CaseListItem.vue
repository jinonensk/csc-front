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
        <button :disabled="!isValidRates" @click="testDropPrice">Test average drop pice</button>
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
      <p class="case-list-item__rate" :class="{ 'case-list-item__rate--error': !isValidRates }">
        Total drop list items rate (10000): {{ totalDropListItemsRate }}
      </p>
      <draggable
        :model-value="caseItem.dropList"
        group="drop-list"
        handle=".drop-list-item__draggable"
        tag="ul"
        item-key="id"
        @change="handleDraggableChange"
      >
        <template #item="{ element, index }">
          <li class="case-list-item__drop-list-item">
            <DropListItem
              :drop-item="element"
              @remove="handleRemoveDropListItem(index)"
              @copy="handleCopyDropListItem(index)"
            />
          </li>
        </template>
      </draggable>
    </template>
  </div>
  <UiConfirmModal ref="modal" />
  <UiConfirmModal ref="answerModal" hide-yes-button hide-no-button />
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import DropListItem from "@/components/DropListItem.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";
import UiImageDropArea from "@/components/ui-kit/UiImageDropArea.vue";
import UiConfirmModal from "@/components/ui-kit/UiConfirmModal.vue";

import { getRandomValue } from "@/utils/get-random-value";

export default {
  name: "CaseListItem",
  components: {
    DropListItem,
    UiFAIconCircleButton,
    UiImageDropArea,
    UiConfirmModal,
    draggable,
  },
  props: {
    caseItem: { type: Object, required: true },
  },
  emits: {
    remove: null,
    copy: null,
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    ...mapState(["fileToFileNameMap"]),
    totalDropListItemsRate() {
      return this.caseItem.dropList.reduce((acc, item) => acc + +item.rate, 0);
    },
    isValidRates() {
      return +this.totalDropListItemsRate === 10000;
    },
  },
  methods: {
    ...mapActions([
      "updateCaseData",
      "addFileToFileMap",
      "handleDragAndDropDropListItem",
      "addNewItemToDropList",
      "copyDropListItem",
      "removeDropListItem",
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

      this.handleDragAndDropDropListItem({
        ...data,
        caseId: this.caseItem.id,
        action: actionNameMap[action],
      });
    },

    handleAddClick() {
      this.addNewItemToDropList({ caseId: this.caseItem.id });
    },

    handleCopyClick() {
      this.$emit("copy");
    },

    async handleDeleteClick() {
      this.$emit("remove");
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

    async handleRemoveDropListItem(dropItemIdx) {
      const res = await this.$refs.modal.open({ title: "Remove drop list?" });
      if (res) this.removeDropListItem({ caseId: this.caseItem.id, dropItemIdx });
    },

    handleCopyDropListItem(dropItemIdx) {
      this.copyDropListItem({ caseId: this.caseItem.id, dropItemIdx });
    },

    testDropPrice() {
      const MAX_PROB = 10000;
      const TEST_RUN_COUNT = 1000;
      let totalSell = 0;
      // const log = [];
      const cumulativeProbs = {};

      let sum = 0;
      this.caseItem.dropList.forEach((dropListItem) => {
        const { rate, itemList } = dropListItem;
        sum += +rate;
        cumulativeProbs[sum] = itemList;
      });

      const cumulatimeProbEntris = Object.entries(cumulativeProbs);

      for (let i = 0; i <= TEST_RUN_COUNT; i++) {
        const prob = getRandomValue(0, MAX_PROB);
        let resultItemList;

        for (let j = 0; j < cumulatimeProbEntris.length; j++) {
          const [key, value] = cumulatimeProbEntris[j];
          if (prob <= key) {
            resultItemList = value;
            break;
          }
        }
        // console.log(`${prob}: ${resultItemList}`);

        const index = getRandomValue(0, resultItemList.length - 1);
        const { itemPrice, name } = resultItemList[index];
        if (!itemPrice) throw new Error(`No price, item: ${name}`);
        // log.push(itemPrice);
        totalSell += +itemPrice;
      }

      const result = Math.round(totalSell / TEST_RUN_COUNT);
      // console.log("RESULT", log);
      // console.log("cumulativeProbs", cumulativeProbs);
      // console.log("cumulativeProbs", cumulativeProbs);
      this.$refs.answerModal.open({
        title: result,
        text: `(average by ${TEST_RUN_COUNT} runs)`,
      });
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
