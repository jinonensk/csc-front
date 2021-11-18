import { v4 as uuidv4 } from "uuid";
import { copyItem } from "./copy-item";

export const copyDropListItem = (item) => {
  const newId = uuidv4();
  const copiedDropListItem = { ...item, id: newId };
  const copiedItemList = copiedDropListItem.itemList
    .map(copyItem)
    .map((el) => ({ ...el, dropRateId: newId }));

  copiedDropListItem.itemList = copiedItemList;
  return copiedDropListItem;
};
