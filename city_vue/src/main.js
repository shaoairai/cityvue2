import "./assets/img/icomoon/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 載入 bs
import "./assets/all.scss";

// VeeValidate import
import { Field, Form, ErrorMessage, defineRule, configure } from "vee-validate";
import * as AllRules from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// VeeValidate
app.component("VForm", Form);
app.component("VField", Field);
app.component("ErrorMessage", ErrorMessage);

// 加入全部可用的驗證規則
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

// 多國語系
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale("zh_TW");

app.mount("#app");

// bs modal
import "bootstrap/dist/js/bootstrap.js";
