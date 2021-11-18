import {
  SET_APP,
  SET_FILE_TO_FILE_MAP,
  SET_INPUT_FILE_LOADER_MULTIPLE_REF,
  SET_INPUT_FILE_LOADER_REF,
  UPDATE_APP_DATA,
  UPDATE_CASE_DATA,
  UPDATE_DROP_ITEM_DATA,
  UPDATE_ITEM_DATA,
} from "./mutations-type";

const draggableHandlers = {
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

export default {
  setApp: ({ commit }, app) => {
    commit(SET_APP, app);
  },
  updateItemData: ({ commit, getters }, { id, data }) => {
    const { caseIdx, dropIdx, itemIdx } = getters.itemsMap[id];
    commit(UPDATE_ITEM_DATA, { caseIdx, dropIdx, itemIdx, data });
  },
  setInputFileLoaderRef: ({ commit }, { ref }) => {
    commit(SET_INPUT_FILE_LOADER_REF, { ref });
  },
  setInputFileLoaderMultipleRef: ({ commit }, { ref }) => {
    commit(SET_INPUT_FILE_LOADER_MULTIPLE_REF, { ref });
  },
  addFileToFileMap: ({ commit }, { file }) => {
    commit(SET_FILE_TO_FILE_MAP, { file });
  },

  ...draggableHandlers,
};
