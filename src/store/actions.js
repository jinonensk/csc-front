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
  UPDATE_DROP_LIST_ITEM_DATA,
  UPDATE_ITEM_DATA,
} from "./mutations-type";

const arrayHelper = {
  insert: ({ array, element, newIndex }) => {
    const newArray = [...array];
    newArray.splice(newIndex, 0, element);
    return newArray;
  },
  remove: ({ array, oldIndex }) => {
    const newArray = [...array];
    newArray.splice(oldIndex, 1);
    return newArray;
  },
  move: ({ array, element, oldIndex, newIndex }) => {
    const newArray = [...array];
    newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, element);
    return newArray;
  },
  add: ({ array, element }) => {
    const newArray = [...array];
    newArray.push(element);
    return newArray;
  },
};

const appHandlers = {
  handleDraggableCaseListMoved: ({ commit, state }, { action, ...rest }) => {
    const { caseList } = state.app;
    const handler = arrayHelper[action];

    const newCaseList = handler({ array: caseList, ...rest });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  addNewCase({ commit, state }) {
    const { caseList } = state.app;

    const element = makeDraftCase();
    const newCaseList = arrayHelper.add({ array: caseList, element });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  copyCaseListItem: ({ commit, getters, state }, { caseId }) => {
    const { caseList } = state.app;
    const caseIdx = getters.caseListMap[caseId];

    const element = copyCaseListItem(caseList[caseIdx]);
    const newCaseList = arrayHelper.add({ array: caseList, element });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  deleteCaseListItem: ({ commit, getters, state }, { caseId }) => {
    const { caseList } = state.app;
    const caseIdx = getters.caseListMap[caseId];

    const newCaseList = arrayHelper.remove({ array: caseList, oldIndex: caseIdx });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
};

const caseHandlers = {
  handleDragAndDropDropList: (store, { caseId, action, element, oldIndex, newIndex }) => {
    const caseIdx = store.getters.caseListMap[caseId];
    const dropList = [...store.state.app.caseList[caseIdx].dropList];
    const handler = arrayHelper[action];

    if (action === "insert") {
      const { itemList } = element;
      for (let i = 0; i < itemList.length; i++) {
        itemList[i].caseId = caseId;
      }
    }

    const newDropList = handler({ array: dropList, newIndex, oldIndex, element });

    store.commit(UPDATE_CASE_DATA, { caseIdx, data: { key: "dropList", value: newDropList } });
  },
  removeDropListItem: ({ commit, getters, state }, { dropId }) => {
    const { caseIdx, dropIdx } = getters.dropListMap[dropId];
    const { dropList } = state.app.caseList[caseIdx];

    const newDropList = arrayHelper.remove({ array: dropList, oldIndex: dropIdx });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  copyDropListItem: ({ commit, getters, state }, { dropId }) => {
    const { caseIdx, dropIdx } = getters.dropListMap[dropId];
    const { dropList } = state.app.caseList[caseIdx];

    const element = copyDropListItem(dropList[dropIdx]);
    const newDropList = arrayHelper.add({ array: dropList, element });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  addNewDropListItemToCaseList: ({ commit, getters, state }, { caseId }) => {
    const caseIdx = getters.caseListMap[caseId];
    const { dropList } = state.app.caseList[caseIdx];

    const element = makeDraftDropListItem({ caseId });
    const newDropList = arrayHelper.add({ array: dropList, element });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  updateCaseData: ({ commit, getters }, { caseId, data }) => {
    const caseIdx = getters.caseListMap[caseId];

    commit(UPDATE_CASE_DATA, { caseIdx, data });
  },
};

const dropListItemHandlers = {
  handleDragAndDropItem: (store, { dropId, action, element, oldIndex, newIndex }) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[dropId];
    const currentCase = store.state.app.caseList[caseIdx];
    const itemList = [...currentCase.dropList[dropIdx].itemList];
    const handler = arrayHelper[action];

    if (action === "insert") {
      element.caseId = currentCase.id;
      element.dropRateId = dropId;
    }

    const newItemList = handler({ array: itemList, newIndex, oldIndex, element });

    store.commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  removeItem: (store, { id }) => {
    const { caseIdx, dropIdx, itemIdx } = store.getters.itemsMap[id];
    const { itemList } = store.state.app.caseList[caseIdx].dropList[dropIdx];

    const newItemList = arrayHelper.remove({ array: itemList, oldIndex: itemIdx });

    store.commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  copyItem: (store, { id }) => {
    const { caseIdx, dropIdx, itemIdx } = store.getters.itemsMap[id];
    const { itemList } = store.state.app.caseList[caseIdx].dropList[dropIdx];

    const element = copyItem(itemList[itemIdx]);
    const newItemList = arrayHelper.add({ array: itemList, element });

    store.commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  addNewItemToDropList: (store, { dropId, initialItemData = {} }) => {
    const { caseIdx, dropIdx } = store.getters.dropListMap[dropId];
    const currentCase = store.state.app.caseList[caseIdx];
    const { itemList } = currentCase.dropList[dropIdx];

    const element = makeDraftItem({ dropId, caseId: currentCase.id });
    const newItemList = arrayHelper.add({
      array: itemList,
      element: { ...element, ...initialItemData },
    });

    store.commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  updateDropListItemData: ({ commit, getters }, { dropId, data }) => {
    const { caseIdx, dropIdx } = getters.dropListMap[dropId];

    commit(UPDATE_DROP_LIST_ITEM_DATA, { caseIdx, dropIdx, data });
  },
};

const itemHandlers = {
  updateItemData: ({ commit, getters }, { id, data }) => {
    const { caseIdx, dropIdx, itemIdx } = getters.itemsMap[id];

    commit(UPDATE_ITEM_DATA, { caseIdx, dropIdx, itemIdx, data });
  },
};

export default {
  setApp: ({ commit }, app) => {
    commit(SET_APP, app);
  },

  addFileToFileMap: ({ commit }, { file }) => {
    commit(SET_FILE_TO_FILE_MAP, { file });
  },

  ...appHandlers,
  ...dropListItemHandlers,
  ...caseHandlers,
  ...itemHandlers,
};
