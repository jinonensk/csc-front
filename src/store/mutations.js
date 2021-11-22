import {
  SET_APP,
  SET_FILE_TO_FILE_MAP,
  UPDATE_APP_DATA,
  UPDATE_CASE_DATA,
  UPDATE_DROP_LIST_ITEM_DATA,
  UPDATE_ITEM_DATA,
} from "./mutations-type";

export default {
  [SET_APP]: (state, app) => {
    state.app = app;
  },
  [UPDATE_APP_DATA]: (state, { key, value }) => {
    state.app[key] = value;
  },

  [UPDATE_CASE_DATA]: (state, { caseIdx, data }) => {
    const { key, value } = data;
    state.app.caseList[caseIdx][key] = value;
  },

  [UPDATE_DROP_LIST_ITEM_DATA]: (state, { caseIdx, dropItemIdx, data }) => {
    const { key, value } = data;
    state.app.caseList[caseIdx].dropList[dropItemIdx][key] = value;
  },

  [UPDATE_ITEM_DATA]: (state, { caseIdx, dropItemIdx, itemIdx, data }) => {
    const { key, value } = data;
    state.app.caseList[caseIdx].dropList[dropItemIdx].itemList[itemIdx][key] = value;
  },

  [SET_FILE_TO_FILE_MAP]: (state, { file }) => {
    state.fileToFileNameMap[file.name] = file;
  },
};
