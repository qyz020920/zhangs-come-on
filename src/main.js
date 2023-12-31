import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "./style.css";
import router from "./routes";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
