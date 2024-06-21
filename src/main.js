import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Quasar, Notify } from "quasar";
import axios from "axios";
import "quasar/dist/quasar.css";

const app = createApp(App);

// Setup Quasar with Notify plugin
app.use(Quasar, {
  plugins: {
    Notify,
  },
});

app.use(router);

app.config.globalProperties.$axios = axios;

app.mount("#app");
