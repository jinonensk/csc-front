import { v4 as uuidv4 } from "uuid";
import { makeDraftItem } from "./make-draft-item";

export const makeDraftDropListItem = ({ caseId, dropRateId = uuidv4() }) => ({
  id: dropRateId,
  rate: 5822,
  color: "#2943c4",
  itemList: [makeDraftItem({ caseId, dropRateId })],
});
