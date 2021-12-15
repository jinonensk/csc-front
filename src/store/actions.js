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

const extractInfo = ({ state, getters, itemId, dropId, caseId }) => {
  if (!state || !getters) throw new Error("need state and getters");

  const { caseListMap, dropListMap, itemsMap } = getters;
  const { caseList } = state.app;

  if (itemId) {
    const { dropItemIdx, caseIdx, itemIdx } = itemsMap[itemId];
    const caseItem = caseList[caseIdx];
    const { dropList } = caseItem;
    const dropListItem = dropList[dropItemIdx];
    const { itemList } = dropListItem;
    const itemListItem = itemList[itemIdx];
    return {
      caseIdx,
      dropItemIdx,
      itemIdx,
      caseList,
      caseItem,
      dropList,
      dropListItem,
      itemList,
      itemListItem,
    };
  }

  if (dropId) {
    const { dropItemIdx, caseIdx } = dropListMap[dropId];
    const caseItem = caseList[caseIdx];
    const { dropList } = caseItem;
    const dropListItem = dropList[dropItemIdx];
    const { itemList } = dropListItem;
    return {
      caseIdx,
      dropItemIdx,
      caseList,
      caseItem,
      dropList,
      dropListItem,
      itemList,
    };
  }

  if (caseId) {
    const caseIdx = caseListMap[caseId];
    const caseItem = caseList[caseIdx];
    const { dropList } = caseItem;
    return {
      caseIdx,
      caseList,
      caseItem,
      dropList,
    };
  }

  return {};
};

// const buildExtractors = ({ state, getters }) => {
//   const caseList = state.app;
//   const { caseListMap, dropListMap, itemsMap } = getters;

//   return {
//     extractInfoByCaseId(id) {
//       const caseIdx = caseListMap[id];
//       const caseItem = caseList[caseIdx];
//       return { caseList, caseItem, caseIdx };
//     },
//     extractInfoByDropId(id) {
//       const { dropItemIdx, caseIdx } = dropListMap[id];
//       const caseItem = caseList[caseIdx];
//       const { dropList } = caseItem;
//       const dropListItem = dropList[dropItemIdx];
//       return { caseList, caseItem, dropList, dropListItem, dropItemIdx, caseIdx };
//     },
//     extractInfoByItemId(id) {
//       const { dropItemIdx, caseIdx, itemIdx } = itemsMap[id];
//       const caseItem = caseList[caseIdx];
//       const { dropList } = caseItem;
//       const dropListItem = dropList[dropItemIdx];
//       const { itemList } = dropListItem;
//       const itemListItem = itemList[itemIdx];
//       return {
//         caseList,
//         caseItem,
//         dropList,
//         dropListItem,
//         itemList,
//         itemListItem,
//         dropItemIdx,
//         caseIdx,
//         itemIdx,
//       };
//     },
//   };
// };

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
    const { caseIdx, dropList } = extractInfo({ state, getters, caseId });
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
    const { caseIdx, dropList } = extractInfo({ state, getters, caseId });

    const newDropList = arrayHelper.remove({ array: dropList, oldIndex: dropItemIdx });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  copyDropListItem: ({ commit, getters, state }, { caseId, dropItemIdx }) => {
    const { caseIdx, dropList } = extractInfo({ state, getters, caseId });

    const element = copyDropListItem(dropList[dropItemIdx]);
    const newDropList = arrayHelper.add({ array: dropList, element });

    commit(UPDATE_CASE_DATA, {
      caseIdx,
      data: { key: "dropList", value: newDropList },
    });
  },
  addNewItemToDropList: ({ commit, getters, state }, { caseId }) => {
    const { caseIdx, dropList } = extractInfo({ state, getters, caseId });

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
    const { caseIdx, dropItemIdx, caseList, itemList } = extractInfo({ state, getters, dropId });

    const handler = arrayHelper[action];

    if (action === "insert") {
      element.caseId = caseList.id;
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
    const { caseIdx, dropItemIdx, itemList } = extractInfo({ state, getters, dropId });

    const newItemList = arrayHelper.remove({ array: itemList, oldIndex: itemIdx });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  copyItemListItem: ({ state, getters, commit }, { dropId, itemIdx }) => {
    const { caseIdx, dropItemIdx, itemList } = extractInfo({ state, getters, dropId });

    const element = copyItem(itemList[itemIdx]);
    const newItemList = arrayHelper.add({ array: itemList, element });

    commit(UPDATE_DROP_LIST_ITEM_DATA, {
      caseIdx,
      dropItemIdx,
      data: { key: "itemList", value: newItemList },
    });
  },
  addNewItemToItemList: ({ state, getters, commit }, { dropId, initialItemData = {} }) => {
    const { caseIdx, dropItemIdx, itemList } = extractInfo({ state, getters, dropId });
    const currentCase = state.app.caseList[caseIdx];

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
  updateDropListItemData: ({ commit, getters, state }, { dropId, data }) => {
    const { caseIdx, dropItemIdx } = extractInfo({ state, getters, dropId });

    commit(UPDATE_DROP_LIST_ITEM_DATA, { caseIdx, dropItemIdx, data });
  },
};

const itemHandlers = {
  updateItemData: ({ commit, getters, state }, { id, data }) => {
    const { caseIdx, dropItemIdx, itemIdx } = extractInfo({ state, getters, itemId: id });

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
