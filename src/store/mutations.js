import { SET_APP, UPDATE_ITEM_DATA } from "./mutations-type";

export default {
  [SET_APP]: (state, app) => {
    state.app = app;
  },
  [UPDATE_ITEM_DATA]: (state, { caseIdx, dropIdx, itemIdx, data }) => {
    const { key, value } = data;
    state.app.caseList[caseIdx].dropList[dropIdx].itemList[itemIdx][key] = value;
  },
};
