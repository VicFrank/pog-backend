import Vue from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";

import { BootstrapVue } from "bootstrap-vue";
Vue.use(BootstrapVue);
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import store from "./store/index.js";
import filters from "./filters/filters";
import router from "./router/router";
import i18n from './i18n'

Vue.use(
  VueGtag,
  {
    config: { id: "UA-165122508-1" },
  },
  router
);

filters.create(Vue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount("#app");
