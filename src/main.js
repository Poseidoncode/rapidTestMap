import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import usePrime from "./plugins/prime";
// import ToastService from "primevue/toastservice";
// import PrimeVue from "primevue/config";
// .use(PrimeVue).use(ToastService)

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
  // You can set your default options here
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true,
};

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./styles/index.scss";
const app = usePrime(createApp(App).use(store).use(router).use(Toast, options));
app.mount("#app");
