import { v4 as uuidv4 } from "uuid";
import { copyItem } from "./copy-item";

const newCaseId = uuidv4();

const copyDropItem = (dropItem) => {
  const dropRateId = uuidv4();
  const copiedDropItem = { ...dropItem };
  copiedDropItem.id = dropRateId;
  copiedDropItem.itemList = copiedDropItem.itemList
    .map(copyItem)
    .map((el) => ({ ...el, dropRateId, caseId: newCaseId }));

  return copiedDropItem;
};

export const copyCaseListItem = (item) => {
  const copiedCase = { ...item, id: newCaseId };
  copiedCase.dropList = copiedCase.dropList.map(copyDropItem);
  return copiedCase;
};
