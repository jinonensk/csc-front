export default {
  caseListMap: (state) => Object.fromEntries(state.app.caseList.map((c, i) => [c.id, i])),
  dropListMap: (state, getters) => {
    const map = {};
    Object.entries(getters.caseListMap).forEach(([, caseIdx]) => {
      const currentCaseList = state.app.caseList[caseIdx];
      currentCaseList.dropList.forEach((d, i) => {
        map[d.id] = { caseIdx, dropIdx: i };
      });
    });
    return map;
  },
  itemsMap: (state, getters) => {
    const map = {};
    Object.entries(getters.dropListMap).forEach(([, { caseIdx, dropIdx }]) => {
      const currentCaseList = state.app.caseList[caseIdx];
      const currentDropList = currentCaseList.dropList[dropIdx];
      currentDropList.itemList.forEach((item, i) => {
        map[item.id] = { caseIdx, dropIdx, itemIdx: i };
      });
    });
    return map;
  },
};
