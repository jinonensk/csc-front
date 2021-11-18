import { v4 as uuidv4 } from "uuid";

export const makeDraftItem = ({ caseId, dropRateId }) => ({
  id: uuidv4(),
  caseId,
  dropRateId,
  itemPrice: 0,
  itemName: "",
  skinName: "",
  skinImg: "",
});
