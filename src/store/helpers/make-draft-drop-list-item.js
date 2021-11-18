import { v4 as uuidv4 } from "uuid";
import { makeDraftItem } from "./make-draft-item";

const dropRateId = uuidv4();

export const makeDraftDropListItem = ({ caseId }) => ({
  id: dropRateId,
  rate: 5822,
  color: "#2943c4",
  itemList: [makeDraftItem({ caseId, dropRateId })],
});
