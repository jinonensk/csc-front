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

const draggableHandlers = {
  handleDraggableItemRemoved: ({ commit }, payload) => {
    console.log("DRAGGABLE_ITEM_REMOVED", payload);
    commit(DRAGGABLE_ITEM_REMOVED, payload);
  },
  handleDraggableItemAdded: ({ commit }, payload) => {
    console.log("DRAGGABLE_ITEM_ADDED", payload);
    commit(DRAGGABLE_ITEM_ADDED, payload);
  },
  handleDraggableItemMoved: ({ commit }, payload) => {
    console.log("DRAGGABLE_ITEM_MOVED", payload);
    commit(DRAGGABLE_ITEM_MOVED, payload);
  },

  handleDraggableDropListAdded: ({ commit }, payload) => {
    console.log("DRAGGABLE_DROP_LIST_ADDED", payload);
    commit(DRAGGABLE_DROP_LIST_ADDED, payload);
  },
  handleDraggableDropListMoved: ({ commit }, payload) => {
    console.log("DRAGGABLE_DROP_LIST_MOVED", payload);
    commit(DRAGGABLE_DROP_LIST_MOVED, payload);
  },
  handleDraggableDropListRemoved: ({ commit }, payload) => {
    console.log("DRAGGABLE_DROP_LIST_REMOVED", payload);
    commit(DRAGGABLE_DROP_LIST_REMOVED, payload);
  },

  handleDraggableCaseListMoved: ({ commit }, payload) => {
    console.log("DRAGGABLE_CASE_LIST_MOVED", payload);
    commit(DRAGGABLE_CASE_LIST_MOVED, payload);
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

  ...draggableHandlers,
};
