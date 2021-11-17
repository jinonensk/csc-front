import { v4 as uuidv4 } from "uuid";

const makeItem = ({ caseId, dropRateId, caseIdx, dropIdx, itemIdx }) => ({
  id: uuidv4(),
  caseId,
  dropRateId,
  itemPrice: "1.08",
  itemName: `Case #${caseIdx} Drop #${dropIdx} Item #${itemIdx}`,
  skinName: "Pixel Camouflage",
  skinImg: "content/Content_AKR12_PixelCamouflage_PreviewHD.png",
});

const makeDropItem = ({ caseId, nItems, caseIdx, dropIdx }) => {
  const id = uuidv4();
  return {
    id,
    rate: 5822,
    color: "#2943c4",
    itemList: new Array(nItems)
      .fill(undefined)
      .map((_, itemIdx) => makeItem({ caseId, dropRateId: id, caseIdx, dropIdx, itemIdx })),
  };
};

const makeCase = ({ nDrops, nItems, caseIdx }) => {
  const id = uuidv4();
  return {
    id,
    caseName: `Case #${caseIdx}`,
    casePrice: "100",
    caseImg: "content/OriginCase_PreviewHD.png",
    caseSpinBackground: "content/OriginCollectionBackground.png",
    dropList: new Array(nDrops)
      .fill(undefined)
      .map((_, dropIdx) => makeDropItem({ caseId: id, nItems, caseIdx, dropIdx })),
  };
};

const makeCaseList = (nCases, nDrops, nItems) =>
  new Array(nCases).fill(undefined).map((_, caseIdx) => makeCase({ nDrops, nItems, caseIdx }));

export const bigMock = { caseList: makeCaseList(2, 2, 1) };
