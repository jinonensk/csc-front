import { v4 as uuidv4 } from "uuid";
import { makeDraftDropListItem } from "./make-draft-drop-list-item";

export const makeDraftCase = (caseId = uuidv4()) => ({
  id: caseId,
  caseName: "",
  casePrice: 0,
  caseImg: "",
  caseSpinBackground: "",
  dropList: [makeDraftDropListItem({ caseId })],
});
