import { makeDraftCase } from "./helpers/make-draft-case";

export default () => ({
  app: {
    caseList: [makeDraftCase()],
  },
  fileToFileNameMap: {},
});
