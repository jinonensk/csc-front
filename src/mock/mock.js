import { v4 as uuidv4 } from "uuid";

const makeItem = ({ caseId, dropRateId }) => ({
  id: uuidv4(),
  caseId,
  dropRateId,
  itemPrice: "1.08",
  itemName: "Case 2 Drop 1 Item 1",
  skinName: "Pixel Camouflage",
  skinImg: "content/Content_AKR12_PixelCamouflage_PreviewHD.png",
});

const makeDropItem = ({ caseId, nItems }) => {
  const id = uuidv4();
  return {
    id,
    rate: 5822,
    color: "#2943c4",
    itemList: new Array(nItems).fill(undefined).map(() => makeItem({ caseId, dropRateId: id })),
  };
};

const makeCase = ({ nDrops, nItems }) => {
  const id = uuidv4();
  return {
    id,
    caseName: "Origin Case",
    casePrice: "100",
    caseImg: "content/OriginCase_PreviewHD.png",
    caseSpinBackground: "content/OriginCollectionBackground.png",
    dropList: new Array(nDrops).fill(undefined).map(() => makeDropItem({ caseId: id, nItems })),
  };
};

const makeCaseList = (nCases, nDrops, nItems) =>
  new Array(nCases).fill(undefined).map(() => makeCase({ nDrops, nItems }));

export const bigMock = { caseList: makeCaseList(1, 1, 10) };
