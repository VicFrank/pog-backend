import { getLevel, getToNextLevel } from "../battlePassExp";

// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  bpExp: 0,
  bpTier: 0,
  isAdmin: false,
};

// getters
const getters = {
  userSteamID: (state) => state.userSteamID,
  username: (state) => state.username,
  profilePictureLink: (state) => state.profilePictureLink,
  loggedIn: (state) => state.userSteamID !== "",
  isAdmin: (state) => state.isAdmin,

  bpExp: (state) => state.bpExp,
  bpLevel: (state) => getLevel(state.bpExp),
  bpLevelProgress: (state) => getToNextLevel(state.bpExp).progress,
  bpLevelRequired: () => getToNextLevel(state.bpExp).goal,
  bpTier: (state) => state.bpTier,
};

const mutations = {
  setUser(state, { username, steamID, picture, isAdmin }) {
    state.username = username;
    state.userSteamID = steamID;
    state.profilePictureLink = picture;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
  },
  setNotLoggedIn(state) {
    state.username = "";
    state.userSteamID = "";
    state.bpExp = 0;
    state.bpTier = 0;
    state.profilePictureLink = "";
    state.loggedIn = false;
  },
  setBattlePass(state, { bpExp, bpTier }) {
    state.bpExp = bpExp;
    state.bpTier = bpTier;
  },
};

// actions
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
