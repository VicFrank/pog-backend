import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import i18n from "../i18n";

import Achievements from "../components/pages/Achievements";
import Changelog from "../components/pages/Changelog";
import Cosmetics from "../components/pages/cosmetics/Cosmetics";
import MatchHistory from "../components/pages/MatchHistory";
import MyStats from "../components/pages/MyStats";
import Profile from "../components/pages/Profile";
import BattlePass from "../components/pages/cosmetics/BattlePass";
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
const Horse = () => import("../components/pages/temp/Horse");

import PoggersStore from "../components/pages/cosmetics/RealMoneyStore";
import Checkout from "../components/pages/payment/Checkout";
import PaymentSuccess from "../components/pages/payment/PaymentSuccess";
import AlipayPayment from "../components/pages/payment/AlipayPayment";

const Subscriptions = () =>
  import("../components/pages/subscriptions/Subscriptions");
const SubscriptionCheckout = () =>
  import("../components/pages/subscriptions/SubscriptionCheckout");
const SubscriptionStatus = () =>
  import("../components/pages/subscriptions/SubscriptionStatus");
const StripeSuccess = () =>
  import("../components/pages/subscriptions/StripeSuccess");
const StripeCancel = () =>
  import("../components/pages/subscriptions/StripeCancel");
const Patreon = () => import("../components/pages/patreon/Patreon");
const RewardSuccess = () => import("../components/pages/patreon/RewardSuccess");
const RewardFail = () => import("../components/pages/patreon/RewardFail");

const CustomHeroPage = () => import("../components/pages/learn/HeroPage");
const CustomHeroes = () => import("../components/pages/learn/CustomHeroes");

const Bracket = () => import("../components/pages/tournaments/Bracket");

Vue.use(VueRouter);

const routes = [
  { path: "/404", alias: "*", component: NotFound },
  { path: "*", redirect: "/404" },
  {
    path: "/",
    component: Home,
  },
  {
    path: "/horse",
    component: Horse,
  },
  {
    path: "/tournament",
    component: Bracket,
  },
  {
    path: "/poggers",
    component: PoggersStore,
  },
  {
    path: "/subscriptions",
    component: Subscriptions,
  },
  {
    path: "/subscriptions/:tier",
    component: SubscriptionCheckout,
  },
  {
    path: "/profile/subscriptions",
    component: SubscriptionStatus,
    meta: { requiresAuth: true },
  },
  {
    path: "/subscriptions/stripe/success",
    component: StripeSuccess,
  },
  {
    path: "/subscriptions/stripe/cancel",
    component: StripeCancel,
  },
  {
    path: "/checkout/:item_id",
    component: Checkout,
  },
  {
    path: "/payment_success",
    component: PaymentSuccess,
  },
  {
    path: "/alipay_payment",
    component: AlipayPayment,
    props: (route) => ({
      source: route.query.source,
      livemode: route.query.livemode,
      clientSecret: route.query.client_secret,
      itemID: route.query.item_id,
    }),
  },
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
    path: "/custom_heroes",
    component: CustomHeroes,
  },
  {
    path: "/custom_heroes/:hero",
    component: CustomHeroPage,
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
    path: "/patreon",
    component: Patreon,
  },
  {
    path: "/patreon/success",
    component: RewardSuccess,
  },
  {
    path: "/patreon/failure",
    component: RewardFail,
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
];

let router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
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

router.beforeEach((to, from, next) => {
  const lang = store.getters.lang;
  if (lang && lang !== i18n.locale) {
    i18n.locale = lang;
    next();
  } else {
    next();
  }
});

export default router;
