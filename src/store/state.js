import { makeDraftCase } from "./helpers/make-draft-case";

export default () => ({
  app: {
    caseList: [makeDraftCase()],
    gameBackground: "0_FON.PNG",
    menuType: "sideMenu",
    spinSound: "",
    dropSound: "",
    musicBackground: "",
    enableEconomic: true,
    startMoney: "17000",
    rewardedVideoReward: "6500",
    clickerReward: "10",
    name: "Call of Duty Case Simulator",
    template: "caseSimulator",
    themeColors: {
      colorPrimary: "#2196f3",
      colorPrimaryDark: "#1976D2",
      colorAccent: "#a829c2",
    },
  },
  fileToFileNameMap: {},
});
