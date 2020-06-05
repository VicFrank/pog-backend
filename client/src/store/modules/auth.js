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
  dailysToClaim: 0,
  upgradeExpiration: null,
  dailyXP: 0,
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
  dailysToClaim: (state) => state.dailysToClaim,
  upgradeExpiration: (state) => state.upgradeExpiration,
  dailyXP: (state) => state.dailyXP,
};

const mutations = {
  setUser(state, { steamID, picture, isAdmin }) {
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
    state.poggers = 0;
    state.profilePictureLink = "";
    state.loggedIn = false;
  },
  SAVE_BATTLE_PASS(
    state,
    { bpLevel, bpTier, bpLevelProgress, bpLevelRequired, upgradeExpiration }
  ) {
    state.bpLevel = bpLevel;
    state.bpTier = bpTier;
    state.bpLevelProgress = bpLevelProgress;
    state.bpLevelRequired = bpLevelRequired;
    state.upgradeExpiration = upgradeExpiration;
  },
  SAVE_POGGERS(state, poggers) {
    state.poggers = poggers;
  },
  SAVE_USER(
    state,
    {
      username,
      steamID,
      isAdmin,
      poggers,
      achievementsToClaim,
      dailysToClaim,
      dailyXP,
    }
  ) {
    state.username = username;
    state.userSteamID = steamID;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.poggers = poggers;
    state.achievementsToClaim = achievementsToClaim;
    state.dailysToClaim = dailysToClaim;
    state.dailyXP = dailyXP;
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
          upgrade_expiration,
        } = player.battlePass;
        let progress = next_level_xp - (total_xp - total_experience);
        if (total_xp === 0) progress = total_experience; // level 0 logic
        commit("SAVE_BATTLE_PASS", {
          bpTier: tier,
          bpLevel: bp_level,
          bpLevelProgress: progress,
          bpLevelRequired: next_level_xp,
          upgradeExpiration: upgrade_expiration,
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
          dailyQuestsToClaim,
          dailyXP,
        } = player;
        const {
          tier,
          total_experience,
          next_level_xp,
          total_xp,
          bp_level,
          upgrade_expiration,
        } = battlePass;
        let progress = next_level_xp - (total_xp - total_experience);
        if (total_xp === 0) progress = total_experience; // level 0 logic
        commit("SAVE_BATTLE_PASS", {
          bpTier: tier,
          bpLevel: bp_level,
          bpLevelProgress: progress,
          bpLevelRequired: next_level_xp,
          upgradeExpiration: upgrade_expiration,
        });
        commit("SAVE_USER", {
          username,
          steamID: steam_id,
          isAdmin: is_admin,
          poggers,
          achievementsToClaim,
          dailysToClaim: dailyQuestsToClaim,
          dailyXP: dailyXP,
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
