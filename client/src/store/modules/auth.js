// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  bpExp: 0,
  bpTier: 0,
};

// getters
const getters = {
  userSteamID: state => state.userSteamID,
  username: state => state.username,
  profilePictureLink: state => state.profilePictureLink,
  loggedIn: state => state.userSteamID !== "",

  bpExp: state => state.bpExp,
  bpLevel: state => Math.floor(state.bpExp / 1000),
  bpLevelProgress: state => state.bpExp % 1000,
  bpLevelRequired: () => 1000,
  bpTier: state => state.bpTier,
};

const mutations = {
  setUser(state, { username, steamID, picture }) {
    state.username = username;
    state.userSteamID = steamID;
    state.profilePictureLink = picture;
    state.loggedIn = true;
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
