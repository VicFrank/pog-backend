function getLocalPlayer(rootState) {
  return {
    username: rootState.auth.username,
    steam_id: rootState.auth.userSteamID,
    avatar: rootState.auth.profilePictureLink,
    team: state.team,
    is_host: state.isHost,
  };
}

const state = {
  connected: false,
  error: "",

  initialLoading: true,
  loadingLobbies: true,

  lobbies: [],

  inLobby: false,
  team: -1,
  isHost: false,
  ready: false,

  chatMessages: [],
  lobbyPlayers: [],
  lobbyPassword: "",
  lobbyRegion: "",
};

const getters = {
  initialLoading: (state) => state.initialLoading,
  loadingLobbies: (state) => state.loadingLobbies,
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
  addMessage({ commit }, data) {
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
  tryJoinLobby({ commit }, lobbyID) {
    commit("TRY_JOIN_LOBBY", lobbyID);
  },
  attemptLeave({ commit }) {
    commit("ATTEMPT_LEAVE_LOBBY");
  },
  leaveLobby({ commit }) {
    commit("LEAVE_LOBBY");
    commit("REFRESH_LOBBIES");
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
  onConnected({ commit }, data) {
    commit("INIT_DATA", data);
  },
  refreshConnection({ commit }) {
    commit("REFRESH_CONNECTION");
  },
};

const mutations = {
  INIT_DATA(state, data) {
    // If we were already in a lobby, throw us in there
    // and initialize the data
    const { player, lobby_players } = data;
    if (player) {
      state.inLobby = true;
      state.lobbyPlayers = lobby_players;
      state.team = player.team;
      state.isHost = player.is_host;
      state.ready = player.ready;
    }

    state.initialLoading = false;
    state.loadingLobbies = false;
  },
  // eslint-disable-next-line no-unused-vars
  REFRESH_CONNECTION(state) {},
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
  REFRESH_LOBBIES(state) {
    state.loadingLobbies = true;
  },
  SET_LOBBIES(state, lobbies) {
    state.loadingLobbies = false;
    state.lobbies = lobbies;
  },
  HOSTED_LOBBY(state) {
    state.inLobby = true;
    state.team = 2;
    state.isHost = true;

    const player = getLocalPlayer(this.state);
    state.lobbyPlayers.push(player);
  },
  // eslint-disable-next-line no-unused-vars
  TRY_JOIN_LOBBY(state) {},
  JOIN_LOBBY(state, lobbyPlayers) {
    state.inLobby = true;
    state.lobbyPlayers = lobbyPlayers;
  },
  // eslint-disable-next-line no-unused-vars
  ATTEMPT_LEAVE_LOBBY(state) {},
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
