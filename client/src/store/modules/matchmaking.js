function getLocalPlayer(rootState) {
  return {
    username: rootState.auth.username,
    steamID: rootState.auth.userSteamID,
    avatar: rootState.auth.profilePictureLink,
    team: state.team,
    isHost: state.isHost,
  };
}

const state = {
  connected: false,
  error: "",

  lobbies: [],

  inLobby: false,
  team: -1,
  isHost: false,

  chatMessages: [],
  lobbyPlayers: [],
  lobbyPassword: "",
  lobbyRegion: "",
};

const getters = {
  lobbies: (state) => state.lobbies,
  chatMessages: (state) => state.chatMessages,
  inLobby: (state) => state.inLobby,
  radiantPlayers: (state) => {
    return state.lobbyPlayers.filter((player) => player.team === 2);
  },
  direPlayers: (state) => {
    return state.lobbyPlayers.filter((player) => player.team === 3);
  },
};

const actions = {
  addMessage({ commit, rootState }, message) {
    const player = getLocalPlayer(rootState);
    const data = {
      ...player,
      message,
    };
    commit("ADD_MESSAGE", data);
  },
  clearChat({ commit }) {
    commit("CLEAR_CHAT");
  },
  connectionOpened({ commit }) {
    commit("SET_CONNECTION", true);
  },
  connectionClosed({ commit }) {
    commit("SET_CONNECTION", false);
  },
  connectionError({ commit }, error) {
    commit("SET_ERROR", error);
  },
  sendMessage({ commit }, message) {
    commit("SEND_MESSAGE", message);
  },
  hostLobby({ commit }, message) {
    commit("HOST_LOBBY", message);
  },
  // this is for calling from the websocket plugin
  // to set inlobby state without side effects
  hostedLobby({ commit }) {
    commit("HOSTED_LOBBY");
  },
  joinLobby({ commit }, lobbyPlayers) {
    if (!state.inLobby) {
      commit("JOIN_LOBBY", lobbyPlayers);
    }
  },
  leaveLobby({ commit }) {
    commit("LEAVE_LOBBY");
  },
  playerJoinedLobby({ commit }, lobbyPlayer) {
    commit("ADD_LOBBY_PLAYER", lobbyPlayer);
  },
  playerLeftLobby({ commit }, steamID) {
    commit("REMOVE_LOBBY_PLAYER", steamID);
  },
  updateLobbyPlayers({ commit }, lobbyPlayers) {
    commit("UPDATE_LOBBY_PLAYERS", lobbyPlayers);
  },
  refreshLobbies({ commit }) {
    commit("REFRESH_LOBBIES");
  },
  setLobbies({ commit }, lobbies) {
    commit("SET_LOBBIES", lobbies);
  },
};

const mutations = {
  ADD_MESSAGE(state, message) {
    state.chatMessages.push(message);
  },
  CLEAR_CHAT() {
    state.chatMessages = [];
  },
  SET_CONNECTION(state, message) {
    state.connected = message;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  // eslint-disable-next-line no-unused-vars
  SEND_MESSAGE(state, message) {},
  // eslint-disable-next-line no-unused-vars
  HOST_LOBBY(state, message) {},
  // eslint-disable-next-line no-unused-vars
  REFRESH_LOBBIES(state, message) {},
  SET_LOBBIES(state, lobbies) {
    state.lobbies = lobbies;
  },
  HOSTED_LOBBY(state) {
    state.inLobby = true;
    state.team = 2;
    state.isHost = true;

    const player = getLocalPlayer(this.state);
    state.lobbyPlayers.push(player);
  },
  JOIN_LOBBY(state, lobbyPlayers) {
    state.inLobby = true;
    state.lobbyPlayers = lobbyPlayers;
  },
  LEAVE_LOBBY(state) {
    state.inLobby = false;
    state.lobbyPlayers = [];
    state.chatMessages = [];
    state.lobbyPassword = "";
    state.lobbyRegion = "";
    state.team = -1;
    state.isHost = false;
  },
  ADD_LOBBY_PLAYER(state, lobbyPlayer) {
    state.lobbyPlayers.push(lobbyPlayer);
  },
  REMOVE_LOBBY_PLAYER(state, steamID) {
    state.lobbyPlayers = state.lobbyPlayers.filter(
      (p) => p.steamID !== steamID
    );
  },
  UPDATE_LOBBY_PLAYERS(state, lobbyPlayers) {
    if (state.inLobby) state.lobbyPlayers = lobbyPlayers;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
