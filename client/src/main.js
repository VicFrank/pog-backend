import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";

import Home from "./components/pages/Home";
import Achievements from "./components/pages/Achievements";
import Changelog from "./components/pages/Changelog";
import Cosmetics from "./components/pages/Cosmetics";
import MatchHistory from "./components/pages/MatchHistory";
import MyStats from "./components/pages/MyStats";
import Profile from "./components/pages/Profile";
import Stats from "./components/pages/Stats";
import Store from "./components/pages/Store";
import BattlePass from "./components/pages/battle_pass/BattlePass";
import SplashPage from "./components/SplashPage";
import Game from "./components/pages/games/Game";
import RecentGames from "./components/pages/games/RecentGames";
import HeroStatsList from "./components/pages/games/HeroStatsList";

import store from "./store/index.js";
import filters from "./filters/filters";
filters.create(Vue);

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: SplashPage,
  },
  {
    path: "/demo/",
    component: Home,
  },
  {
    path: "/demo/profile/battle_pass",
    component: BattlePass,
  },
  {
    path: "/demo/profile/achievements",
    component: Achievements,
  },
  {
    path: "/demo/changelog",
    component: Changelog,
  },
  {
    path: "/demo/profile/cosmetics",
    component: Cosmetics,
  },
  {
    path: "/demo/games/:game_id",
    component: Game,
  },
  {
    path: "/demo/games/",
    component: RecentGames,
  },
  {
    path: "/demo/heroes/",
    component: HeroStatsList,
  },
  {
    path: "/demo/profile/games",
    component: MatchHistory,
  },
  {
    path: "/demo/profile/stats",
    component: MyStats,
  },
  {
    path: "/demo/profile",
    component: Profile,
  },
  {
    path: "/demo/profile/heroes",
    component: Stats,
  },
  {
    path: "/demo/store",
    component: Store,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
