// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  bpLevel: 0,
  bpLevelProgress: 0,
  bpLevelRequired: 0,
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

  bpLevel: (state) => state.bpLevel,
  bpLevelProgress: (state) => state.bpLevelProgress,
  bpLevelRequired: (state) => state.bpLevelRequired,
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
  SAVE_BATTLE_PASS(
    state,
    { bpLevel, bpTier, bpLevelProgress, bpLevelRequired }
  ) {
    state.bpLevel = bpLevel;
    state.bpTier = bpTier;
    state.bpLevelProgress = bpLevelProgress;
    state.bpLevelRequired = bpLevelRequired;
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
        const {
          tier,
          total_experience,
          next_level_xp,
          total_xp,
          bp_level,
        } = player.battlePass;
        let progress = next_level_xp - (total_xp - total_experience);
        if (total_xp === 0) progress = total_experience; // level 0 logic
        commit("SAVE_BATTLE_PASS", {
          bpTier: tier,
          bpLevel: bp_level,
          bpLevelProgress: progress,
          bpLevelRequired: next_level_xp,
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
        const {
          battlePass,
          username,
          steam_id,
          is_admin,
          poggers,
          achievementsToClaim,
        } = player;
        const {
          tier,
          total_experience,
          next_level_xp,
          total_xp,
          bp_level,
        } = battlePass;
        let progress = next_level_xp - (total_xp - total_experience);
        if (total_xp === 0) progress = total_experience; // level 0 logic
        commit("SAVE_BATTLE_PASS", {
          bpTier: tier,
          bpLevel: bp_level,
          bpLevelProgress: progress,
          bpLevelRequired: next_level_xp,
        });
        commit("SAVE_USER", {
          username: username,
          steamID: steam_id,
          isAdmin: is_admin,
          poggers: poggers,
          achievementsToClaim: achievementsToClaim,
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
