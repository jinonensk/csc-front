import { SET_APP, UPDATE_ITEM_DATA } from "./mutations-type";

export default {
  setApp: ({ commit }, app) => {
    commit(SET_APP, app);
  },
  updateItemData: ({ commit, getters }, { id, data }) => {
    const { caseIdx, dropIdx, itemIdx } = getters.itemsMap[id];
    commit(UPDATE_ITEM_DATA, { caseIdx, dropIdx, itemIdx, data });
  },
};
