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
import SplashPage from "../components/SplashPage";
import Patrons from "../components/pages/Patrons";
import Game from "../components/pages/games/Game";
import RecentGames from "../components/pages/games/RecentGames";
import HeroStatsList from "../components/pages/games/HeroStatsList";
import FAQ from "../components/pages/learn/FAQ";
import Guardians from "../components/pages/learn/Guardians";
import Media from "../components/pages/learn/Media";
import PlayerPage from "../components/pages/player/PlayerPage";
import PlayerGames from "../components/pages/player/PlayerGames";
import LoginRedirect from "../components/pages/LoginRedirect";
import NotFound from "../components/NotFound";

const Store = () => import("../components/pages/cosmetics/Store");
const Admin = () => import("../components/pages/admin/Admin");
const Home = () => import("../components/pages/home/Home");
const Credits = () => import("../components/pages/credits/Credits");

import PoggersStore from "../components/pages/cosmetics/RealMoneyStore";

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
  {
    path: "/demo/poggers",
    component: PoggersStore,
  },
  {
    path: "/demo/changelog",
    component: Changelog,
  },
  {
    path: "/demo/faq",
    component: FAQ,
  },
  {
    path: "/demo/guardians",
    component: Guardians,
  },
  {
    path: "/demo/media",
    component: Media,
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
    path: "/demo/credits",
    component: Credits,
  },
  {
    path: "/demo/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
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
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next();
    } else {
      next("/demo");
    }
  } else {
    next();
  }
});

export default router;
