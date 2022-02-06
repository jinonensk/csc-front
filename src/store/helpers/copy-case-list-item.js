import { v4 as uuidv4 } from "uuid";
import { copyItem } from "./copy-item";

const copyDropItem = (dropItem, newCaseId) => {
  const dropRateId = uuidv4();
  const copiedDropItem = { ...dropItem };
  copiedDropItem.id = dropRateId;
  copiedDropItem.itemList = copiedDropItem.itemList
    .map(copyItem)
    .map((el) => ({ ...el, dropRateId, caseId: newCaseId }));

  return copiedDropItem;
};

export const copyCaseListItem = (item) => {
  const newCaseId = uuidv4();
  const copiedCase = { ...item, id: newCaseId };
  copiedCase.dropList = copiedCase.dropList.map((el) => copyDropItem(el, newCaseId));
  return copiedCase;
};
