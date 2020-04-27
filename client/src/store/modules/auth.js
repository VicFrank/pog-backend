import { getLevel, getToNextLevel } from "../battlePassExp";

// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  bpExp: 0,
  bpTier: 0,
  isAdmin: false,
  poggers: 0,
  achievementsToClaim: 0,
};

// getters
const getters = {
  userSteamID: (state) => state.userSteamID,
  username: (state) => state.username,
  profilePictureLink: (state) => state.profilePictureLink,
  loggedIn: (state) => state.userSteamID !== "",
  isAdmin: (state) => state.isAdmin,

  bpExp: (state) => state.bpExp,
  // my bp level calculator is one level off
  bpLevel: (state) => getLevel(state.bpExp) - 1,
  bpLevelProgress: (state) => getToNextLevel(state.bpExp).progress,
  bpLevelRequired: () => getToNextLevel(state.bpExp).goal,
  bpTier: (state) => state.bpTier,
  poggers: (state) => state.poggers,
  achievementsToClaim: (state) => state.achievementsToClaim,
};

const mutations = {
  setUser(state, { username, steamID, picture, isAdmin, poggers }) {
    state.username = username;
    state.userSteamID = steamID;
    state.profilePictureLink = picture;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.poggers = poggers;
  },
  setNotLoggedIn(state) {
    state.username = "";
    state.userSteamID = "";
    state.bpExp = 0;
    state.bpTier = 0;
    state.poggers = 0;
    state.profilePictureLink = "";
    state.loggedIn = false;
  },
  setBattlePass(state, { bpExp, bpTier }) {
    state.bpExp = bpExp;
    state.bpTier = bpTier;
  },
  SAVE_POGGERS(state, poggers) {
    state.poggers = poggers;
  },
  SAVE_USER(
    state,
    { username, steamID, isAdmin, poggers, achievementsToClaim }
  ) {
    state.username = username;
    state.userSteamID = steamID;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.poggers = poggers;
    state.achievementsToClaim = achievementsToClaim;
  },
};

// actions
const actions = {
  refreshPoggers({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        commit("SAVE_POGGERS", player.poggers);
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
  refreshBattlePass({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        commit("setBattlePass", {
          bpTier: player.battlePass.tier,
          bpExp: player.battlePass.total_experience,
        });
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
  refreshPlayer({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        commit("setBattlePass", {
          bpTier: player.battlePass.tier,
          bpExp: player.battlePass.total_experience,
        });
        commit("SAVE_USER", {
          username: player.username,
          steamID: player.steam_id,
          isAdmin: player.is_admin,
          poggers: player.poggers,
          achievementsToClaim: player.achievementsToClaim,
        });
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
