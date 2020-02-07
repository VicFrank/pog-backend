// initial state
const state = {
  loggedIn: false,
  userSteamID: "76561198014254115",
  username: "SUNSfan",
  bpLevel: 5,
  profilePictureLink: "",
};

// getters
const getters = {
  userSteamID: state => state.userSteamID,
  username: state => state.username,
  bpLevel: state => state.bpLevel,
  profilePictureLink: state => state.profilePictureLink,
};

// actions
const actions = {};

export default {
  state,
  getters,
  actions,
};
