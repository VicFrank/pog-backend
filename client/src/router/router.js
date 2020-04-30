import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Achievements from "../components/pages/Achievements";
import Changelog from "../components/pages/Changelog";
import Cosmetics from "../components/pages/cosmetics/Cosmetics";
import MatchHistory from "../components/pages/MatchHistory";
import MyStats from "../components/pages/MyStats";
import Profile from "../components/pages/Profile";
import Stats from "../components/pages/Stats";
import BattlePass from "../components/pages/cosmetics/BattlePass";
// import SplashPage from "../components/SplashPage";
import Patrons from "../components/pages/Patrons";
import Game from "../components/pages/games/Game";
import RecentGames from "../components/pages/games/RecentGames";
import HeroStatsList from "../components/pages/games/HeroStatsList";
import FAQ from "../components/pages/learn/FAQ";
import Guardians from "../components/pages/learn/Guardians";
import Media from "../components/pages/learn/Media";
import ChestRates from "../components/pages/learn/ChestRates";
import PlayerPage from "../components/pages/player/PlayerPage";
import PlayerGames from "../components/pages/player/PlayerGames";
import LoginRedirect from "../components/pages/LoginRedirect";
import NotFound from "../components/NotFound";

const Store = () => import("../components/pages/cosmetics/Store");
const Admin = () => import("../components/pages/admin/Admin");
const Home = () => import("../components/pages/home/Home");
const Credits = () => import("../components/pages/credits/Credits");

import PoggersStore from "../components/pages/cosmetics/RealMoneyStore";
// import Payment from "../components/pages/payment/Payment";

Vue.use(VueRouter);

const routes = [
  { path: "/404", alias: "*", component: NotFound },
  { path: "*", redirect: "/404" },
  // {
  //   path: "/",
  //   component: SplashPage,
  // },
  {
    path: "/",
    component: Home,
  },
  {
    path: "/poggers",
    component: PoggersStore,
  },
  // {
  //   path: "/payment/:item_id",
  //   component: Payment,
  // },
  {
    path: "/changelog",
    component: Changelog,
  },
  {
    path: "/faq",
    component: FAQ,
  },
  {
    path: "/guardians",
    component: Guardians,
  },
  {
    path: "/media",
    component: Media,
  },
  {
    path: "/chest_rates",
    component: ChestRates,
  },
  {
    path: "/games",
    component: RecentGames,
  },
  {
    path: "/patrons",
    component: Patrons,
  },
  {
    path: "/games/:game_id",
    component: Game,
  },
  {
    path: "/players/:steam_id",
    component: PlayerPage,
  },
  {
    path: "/players/:steam_id/games",
    component: PlayerGames,
  },
  {
    path: "/heroes",
    component: HeroStatsList,
  },
  {
    path: "/store",
    component: Store,
  },
  {
    path: "/credits",
    component: Credits,
  },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/redirect",
    component: LoginRedirect,
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/battle_pass",
    component: BattlePass,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/achievements",
    component: Achievements,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/armory",
    component: Cosmetics,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/games",
    component: MatchHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/stats",
    component: MyStats,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/heroes",
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
      next("");
    }
  } else {
    next();
  }
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next();
    } else {
      next("");
    }
  } else {
    next();
  }
});

export default router;
