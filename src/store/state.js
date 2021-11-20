export default () => ({
  app: {
    caseList: [
      {
        id: "0000-0000-0000-0000",
        caseName: "Case name",
        casePrice: 100,
        caseImg: "case-img.png",
        caseSpinBackground: "case-spin-background.png",
        dropList: [
          {
            id: "1111-1111-1111-1111",
            rate: 0,
            color: "#E28D8D",
            itemList: [
              {
                id: "2222-2222-2222-2222",
                caseId: "0000-0000-0000-0000",
                dropRateId: "1111-1111-1111-1111",
                itemPrice: 0,
                itemName: "Item name",
                skinName: "Skin name",
                skinImg: "skin-image.png",
              },
            ],
          },
        ],
      },
    ],
  },
  fileToFileNameMap: {},
  inputFileLoaderRef: null,
  inputFileLoaderMultipleRef: null,
});
