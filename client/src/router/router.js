import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Home from "../components/pages/home/Home";
import Achievements from "../components/pages/Achievements";
import Changelog from "../components/pages/Changelog";
import Cosmetics from "../components/pages/cosmetics/Cosmetics";
import MatchHistory from "../components/pages/MatchHistory";
import MyStats from "../components/pages/MyStats";
import Profile from "../components/pages/Profile";
import Stats from "../components/pages/Stats";
import Store from "../components/pages/Store";
import BattlePass from "../components/pages/battle_pass/BattlePass";
import SplashPage from "../components/SplashPage";
import Patrons from "../components/pages/Patrons";
import Game from "../components/pages/games/Game";
import RecentGames from "../components/pages/games/RecentGames";
import HeroStatsList from "../components/pages/games/HeroStatsList";
import Learn from "../components/pages/learn/Learn";
import PlayerPage from "../components/pages/player/PlayerPage";
import PlayerGames from "../components/pages/player/PlayerGames";
import LoginRedirect from "../components/pages/LoginRedirect";
import NotFound from "../components/NotFound";

// import Payment from "../components/pages/store/Payment";

Vue.use(VueRouter);

const routes = [
  { path: "/404", alias: "*", component: NotFound },
  { path: "*", redirect: "/404" },
  {
    path: "/",
    component: SplashPage,
  },
  {
    path: "/demo/",
    component: Home,
  },
  // {
  //   path: "/demo/payment",
  //   component: Payment,
  // },
  {
    path: "/demo/changelog",
    component: Changelog,
  },
  {
    path: "/demo/learn",
    component: Learn,
  },
  {
    path: "/demo/games",
    component: RecentGames,
  },
  {
    path: "/demo/patrons",
    component: Patrons,
  },
  {
    path: "/demo/games/:game_id",
    component: Game,
  },
  {
    path: "/demo/players/:steam_id",
    component: PlayerPage,
  },
  {
    path: "/demo/players/:steam_id/games",
    component: PlayerGames,
  },
  {
    path: "/demo/heroes",
    component: HeroStatsList,
  },
  {
    path: "/demo/store",
    component: Store,
  },
  {
    path: "/demo/redirect",
    component: LoginRedirect,
  },
  {
    path: "/demo/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/battle_pass",
    component: BattlePass,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/achievements",
    component: Achievements,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/armory",
    component: Cosmetics,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/games",
    component: MatchHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/stats",
    component: MyStats,
    meta: { requiresAuth: true },
  },
  {
    path: "/demo/profile/heroes",
    component: Stats,
    meta: { requiresAuth: true },
  },
];

let router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.loggedIn) {
      next();
    } else {
      next("/demo");
    }
  } else {
    next();
  }
});

export default router;
