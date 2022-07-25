import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase/config";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .mount("#app");
  }
});
