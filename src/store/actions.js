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
  copyCase: ({ commit, state }, { caseIdx }) => {
    const { caseList } = state.app;

    const element = copyCaseListItem(caseList[caseIdx]);
    const newCaseList = arrayHelper.add({ array: caseList, element });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
  deleteCase: ({ commit, state }, { caseIdx }) => {
    const { caseList } = state.app;

    const newCaseList = arrayHelper.remove({ array: caseList, oldIndex: caseIdx });

    commit(UPDATE_APP_DATA, { key: "caseList", value: newCaseList });
  },
};

const caseHandlers = {
  handleDragAndDropDropListItem: (
    { state, getters, commit },
    { caseId, action, element, oldIndex, newIndex },
  ) => {
    const caseIdx = getters.caseListMap[caseId];
    const { dropList } = state.app.caseList[caseIdx];
    const handler = arrayHelper[action];

    if (action === "insert") {
      const { itemList } = element;
      for (let i = 0; i < itemList.length; i++) {
        itemList[i].caseId = caseId;
      }
    }

    const newDropList = handler({ array: dropList, newIndex, oldIndex, element });

    commit(UPDATE_CASE_DATA, { caseIdx, data: { key: "dropList", value: newDropList } });
  },
  removeDropListItem: ({ commit, getters, state }, { caseId, dropItemIdx }) => {
    const caseIdx = getters.caseListMap[caseId];
    const { dropList } = state.app.caseList[caseIdx];

    const newDropList = arrayHelper.remove({ array: dropList, oldIndex: dropItemIdx });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  copyDropListItem: ({ commit, getters, state }, { caseId, dropItemIdx }) => {
    const caseIdx = getters.caseListMap[caseId];
    const { dropList } = state.app.caseList[caseIdx];

    const element = copyDropListItem(dropList[dropItemIdx]);
    const newDropList = arrayHelper.add({ array: dropList, element });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  addNewItemToDropList: ({ commit, getters, state }, { caseId }) => {
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
  handleDragAndDropItem: (
    { state, getters, commit },
    { dropId, action, element, oldIndex, newIndex },
  ) => {
    const { caseIdx, dropItemIdx } = getters.dropListMap[dropId];
    const currentCase = state.app.caseList[caseIdx];
    const itemList = [...currentCase.dropList[dropItemIdx].itemList];
    const handler = arrayHelper[action];

    if (action === "insert") {
      element.caseId = currentCase.id;
      element.dropRateId = dropId;
    }

    const newItemList = handler({ array: itemList, newIndex, oldIndex, element });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  removeItemListItem: ({ state, getters, commit }, { dropId, itemIdx }) => {
    const { caseIdx, dropItemIdx } = getters.dropListMap[dropId];
    const { itemList } = state.app.caseList[caseIdx].dropList[dropItemIdx];

    const newItemList = arrayHelper.remove({ array: itemList, oldIndex: itemIdx });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  copyItemListItem: ({ state, getters, commit }, { dropId, itemIdx }) => {
    const { caseIdx, dropItemIdx } = getters.dropListMap[dropId];
    const { itemList } = state.app.caseList[caseIdx].dropList[dropItemIdx];

    const element = copyItem(itemList[itemIdx]);
    const newItemList = arrayHelper.add({ array: itemList, element });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  addNewItemToItemList: ({ state, getters, commit }, { dropId, initialItemData = {} }) => {
    const { caseIdx, dropItemIdx } = getters.dropListMap[dropId];
    const currentCase = state.app.caseList[caseIdx];
    const { itemList } = currentCase.dropList[dropItemIdx];

    const element = makeDraftItem({ dropId, caseId: currentCase.id });
    const newItemList = arrayHelper.add({
      array: itemList,
      element: { ...element, ...initialItemData },
    });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  updateDropListItemData: ({ commit, getters }, { dropId, data }) => {
    const { caseIdx, dropItemIdx } = getters.dropListMap[dropId];

    commit(UPDATE_DROP_LIST_ITEM_DATA, { caseIdx, dropItemIdx, data });
  },
};

const itemHandlers = {
  updateItemData: ({ commit, getters }, { id, data }) => {
    const { caseIdx, dropItemIdx, itemIdx } = getters.itemsMap[id];

    commit(UPDATE_ITEM_DATA, { caseIdx, dropItemIdx, itemIdx, data });
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
