import "./assets/main.css";
import 'vue-select/dist/vue-select.css';

import { createApp } from "vue";
import App from "./App.vue";
import vSelect from "vue-select";

const app = createApp(App);
app.component("v-select", vSelect);
app.mount("#app");
