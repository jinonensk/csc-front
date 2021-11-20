import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faPlus,
  faAngleDown,
  faAngleUp,
  faClone,
} from "@fortawesome/free-solid-svg-icons";

import "@/assets/global.scss";

import App from "./App.vue";
import store from "./store";

library.add([faTimes, faPlus, faAngleDown, faAngleUp, faClone]);

const app = createApp(App);
app.config.productionTip = false;
app.use(store).mount("#app");
