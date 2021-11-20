import { copyCaseListItem } from "./helpers/copy-case-list-item";
import { copyDropListItem } from "./helpers/copy-drop-list-item";
import { copyItem } from "./helpers/copy-item";
import { makeDraftCase } from "./helpers/make-draft-case";
import { makeDraftDropListItem } from "./helpers/make-draft-drop-list-item";
import { makeDraftItem } from "./helpers/make-draft-item";
import {
  SET_APP,
  SET_FILE_TO_FILE_MAP,
  UPDATE_APP_DATA,
  UPDATE_CASE_DATA,
  UPDATE_DROP_ITEM_DATA,
  UPDATE_ITEM_DATA,
} from "./mutations-type";

const draggableHandler = {
  handleDraggableItemAdded: (store, payload) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[payload.dropId];
    const currentCaseList = store.state.app.caseList[caseIdx];
    const newArray = [...currentCaseList.dropList[dropIdx].itemList];

    payload.element.caseId = currentCaseList.id;
    payload.element.dropRateId = payload.dropId;
    newArray.splice(payload.newIndex, 0, payload.element);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },
  handleDraggableItemRemoved: (store, payload) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[payload.dropId];
    const newArray = [...store.state.app.caseList[caseIdx].dropList[dropIdx].itemList];

    newArray.splice(payload.oldIndex, 1);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },
  handleDraggableItemMoved: (store, payload) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[payload.dropId];
    const newArray = [...store.state.app.caseList[caseIdx].dropList[dropIdx].itemList];

    newArray.splice(payload.oldIndex, 1);
    newArray.splice(payload.newIndex, 0, payload.element);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },

  handleDraggableDropListAdded: (store, payload) => {
    const caseIdx = store.getters.caseListMap[payload.caseId];
    const newArray = [...store.state.app.caseList[caseIdx].dropList];

    const { itemList } = payload.element;
    for (let i = 0; i < itemList.length; i++) {
      itemList[i].caseId = payload.caseId;
    }
    newArray.splice(payload.newIndex, 0, payload.element);

    store.commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newArray },
    });
  },
  handleDraggableDropListRemoved: (store, payload) => {
    const caseIdx = store.getters.caseListMap[payload.caseId];
    const newArray = [...store.state.app.caseList[caseIdx].dropList];

    newArray.splice(payload.oldIndex, 1);

    store.commit(UPDATE_CASE_DATA, { caseIdx, data: { key: "dropList", value: newArray } });
  },
  handleDraggableDropListMoved: (store, payload) => {
    const caseIdx = store.getters.caseListMap[payload.caseId];
    const newArray = [...store.state.app.caseList[caseIdx].dropList];

    newArray.splice(payload.oldIndex, 1);
    newArray.splice(payload.newIndex, 0, payload.element);

    store.commit(UPDATE_CASE_DATA, { caseIdx, data: { key: "dropList", value: newArray } });
  },

  handleDraggableCaseListMoved: (store, payload) => {
    const newArray = [...store.state.app.caseList];

    newArray.splice(payload.oldIndex, 1);
    newArray.splice(payload.newIndex, 0, payload.element);

    store.commit(UPDATE_APP_DATA, { key: "caseList", value: newArray });
  },
};

const itemHadler = {
  updateItemData: ({ commit, getters }, { id, data }) => {
    const { caseIdx, dropIdx, itemIdx } = getters.itemsMap[id];

    commit(UPDATE_ITEM_DATA, { caseIdx, dropIdx, itemIdx, data });
  },
  removeItem: (store, { id }) => {
    const { caseIdx, dropIdx, itemIdx } = store.getters.itemsMap[id];
    const newArray = [...store.state.app.caseList[caseIdx].dropList[dropIdx].itemList];

    newArray.splice(itemIdx, 1);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },
  copyItem: (store, { id }) => {
    const { caseIdx, dropIdx, itemIdx } = store.getters.itemsMap[id];
    const newArray = [...store.state.app.caseList[caseIdx].dropList[dropIdx].itemList];

    const copiedItem = copyItem(newArray[itemIdx]);
    newArray.push(copiedItem);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },
  addNewItemToDropList: (store, { dropId, initialItemData = {} }) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[dropId];
    const currentCase = store.state.app.caseList[caseIdx];

    const newArray = [...currentCase.dropList[dropIdx].itemList];
    const newItem = { ...makeDraftItem({ dropId, caseId: currentCase.id }), ...initialItemData };
    newArray.push(newItem);

    store.commit(UPDATE_DROP_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newArray },
    });
  },
};

const dropListHandler = {
  removeDropListItem: (store, { dropId }) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[dropId];
    const newDropList = [...store.state.app.caseList[caseIdx].dropList];

    newDropList.splice(dropIdx, 1);

    store.commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  copyDropListItem: (store, { dropId }) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[dropId];
    const newDropList = [...store.state.app.caseList[caseIdx].dropList];

    const copiedItem = copyDropListItem(newDropList[dropIdx]);
    newDropList.push(copiedItem);

    store.commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  addNewDropListItemToCaseList: (store, { caseId }) => {
    const caseIdx = store.getters.caseListMap[caseId];
    const currentCase = store.state.app.caseList[caseIdx];

    const newDropList = [...currentCase.dropList, makeDraftDropListItem({ caseId })];
    // const newDrooListItem = makeDraftDropListItem({ caseId });
    // newDropList.push(newDrooListItem);

    store.commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
};

const caseListHandler = {
  addNewCase(store) {
    const newCaseList = [...store.state.app.caseList];
    const newCase = makeDraftCase();

    newCaseList.push(newCase);
    store.commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  copyCaseListItem: (store, { caseId }) => {
    const caseIdx = store.getters.caseListMap[caseId];
    const newCaseList = [...store.state.app.caseList];

    const copiedItem = copyCaseListItem(newCaseList[caseIdx]);
    newCaseList.push(copiedItem);

    store.commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  deleteCaseListItem: (store, { caseId }) => {
    const caseIdx = store.getters.caseListMap[caseId];
    const newCaseList = [...store.state.app.caseList];

    newCaseList.splice(caseIdx, 1);

    store.commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
};

export default {
  setApp: ({ commit }, app) => {
    commit(SET_APP, app);
  },

  addFileToFileMap: ({ commit }, { file }) => {
    commit(SET_FILE_TO_FILE_MAP, { file });
  },

  ...draggableHandler,
  ...itemHadler,
  ...dropListHandler,
  ...caseListHandler,
};
