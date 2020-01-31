import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";

import Home from "./components/static/Home";
import Achievements from "./components/static/Achievements";
import Changelog from "./components/static/Changelog";
import Cosmetics from "./components/static/Cosmetics";
import DetailHistory from "./components/static/DetailHistory";
import MatchHistory from "./components/static/MatchHistory";
import MyStats from "./components/static/MyStats";
import Profile from "./components/static/Profile";
import Quests from "./components/static/Quests";
import Stats from "./components/static/Stats";
import Store from "./components/static/Store";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/Achievements",
    component: Achievements,
  },
  {
    path: "/Changelog",
    component: Changelog,
  },
  {
    path: "/Cosmetics",
    component: Cosmetics,
  },
  {
    path: "/DetailHistory",
    component: DetailHistory,
  },
  {
    path: "/MatchHistory",
    component: MatchHistory,
  },
  {
    path: "/MyStats",
    component: MyStats,
  },
  {
    path: "/Profile",
    component: Profile,
  },
  {
    path: "/Quests",
    component: Quests,
  },
  {
    path: "/Stats",
    component: Stats,
  },
  {
    path: "/Store",
    component: Store,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
