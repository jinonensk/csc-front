import {
  DRAGGABLE_CASE_LIST_MOVED,
  DRAGGABLE_DROP_LIST_ADDED,
  DRAGGABLE_DROP_LIST_MOVED,
  DRAGGABLE_DROP_LIST_REMOVED,
  DRAGGABLE_ITEM_ADDED,
  DRAGGABLE_ITEM_MOVED,
  DRAGGABLE_ITEM_REMOVED,
  SET_APP,
  UPDATE_ITEM_DATA,
} from "./mutations-type";

const draggableMutations = {
  [DRAGGABLE_ITEM_REMOVED]: (state, payload) => {
    console.log({ state, payload });
  },
  [DRAGGABLE_ITEM_ADDED]: (state, payload) => {
    console.log({ state, payload });
  },
  [DRAGGABLE_ITEM_MOVED]: (state, payload) => {
    console.log({ state, payload });
  },

  [DRAGGABLE_DROP_LIST_ADDED]: (state, payload) => {
    console.log({ state, payload });
  },
  [DRAGGABLE_DROP_LIST_MOVED]: (state, payload) => {
    console.log({ state, payload });
  },
  [DRAGGABLE_DROP_LIST_REMOVED]: (state, payload) => {
    console.log({ state, payload });
  },

  [DRAGGABLE_CASE_LIST_MOVED]: (state, payload) => {
    console.log({ state, payload });
  },
};

export default {
  [SET_APP]: (state, app) => {
    state.app = app;
  },
  [UPDATE_ITEM_DATA]: (state, { caseIdx, dropIdx, itemIdx, data }) => {
    const { key, value } = data;
    state.app.caseList[caseIdx].dropList[dropIdx].itemList[itemIdx][key] = value;
  },

  ...draggableMutations,
};
