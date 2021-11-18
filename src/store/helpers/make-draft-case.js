import { v4 as uuidv4 } from "uuid";
import { makeDraftDropListItem } from "./make-draft-drop-list-item";

const caseId = uuidv4();

export const makeDraftCase = () => ({
  id: caseId,
  caseName: "",
  casePrice: 0,
  caseImg: "",
  caseSpinBackground: "",
  dropList: [makeDraftDropListItem({ caseId })],
});
