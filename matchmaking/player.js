class Player {
  lobby;
  team;
  isHost;

  constructor(steamID, username, ws) {
    this.steamID = steamID;
    this.username = username;
    this.ws = ws;
    this.lobby = null;
    this.team = null;
    this.isHost = false;
  }

  joinLobby(lobby) {
    this.lobby = lobby;
  }

  leaveLobby() {
    this.lobby = null;
    this.team = null;
  }

  inLobby() {
    return this.lobby !== null;
  }

  getPlayerData() {
    return {
      steamID: this.steamID,
      username: this.username,
    };
  }

  sendMessage(event, data) {
    const msg = JSON.stringify({ event, data });
    if (this.ws) {
      this.ws.send(msg);
    }
  }
}

module.exports = Player;
