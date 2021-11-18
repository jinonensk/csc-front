export default () => ({
  app: {
    caseList: [
      {
        id: "0000-0000-0000-0000",
        caseName: "",
        casePrice: 0,
        caseImg: "caseImg.png",
        caseSpinBackground: "caseSpinBackground.png",
        dropList: [
          {
            id: "1111-1111-1111-1111",
            rate: 0,
            color: "#FFFFFF",
            itemList: [
              {
                id: "2222-2222-2222-2222",
                caseId: "0000-0000-0000-0000",
                dropRateId: "1111-1111-1111-1111",
                itemPrice: 0,
                itemName: "",
                skinName: "",
                skinImg: "",
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
