const Player = require("./player");

const MAX_SIZE = 6;
const DOTA_TEAM_GOODGUYS = 2;
const DOTA_TEAM_BADGUYS = 3;

class Lobby {
  password;

  constructor(lobbyID, creator, region, minRank, maxRank) {
    this.lobbyID = lobbyID;
    this.players = [];
    this.region = region;
    this.minRank = minRank;
    this.maxRank = maxRank;

    creator.isHost = true;

    this.maxSize = MAX_SIZE;

    this.addPlayer(creator, 2);
  }

  contains(player) {
    return this.players.some((p) => (p.steamID = player.steamID));
  }

  isFull() {
    return this.players.length >= this.maxSize;
  }

  getPlayersOnTeam(team) {
    return this.players.filter((player) => player.team === team);
  }

  addPlayer(player) {
    if (this.isFull()) return;

    // get the team for the player
    // place them on radiant if there is room, otherwise dire
    let team = DOTA_TEAM_GOODGUYS;
    const numRadiant = this.getPlayersOnTeam(DOTA_TEAM_GOODGUYS).length;
    if (numRadiant === 3) {
      team = DOTA_TEAM_BADGUYS;
    }

    this.players.push(player);
    player.joinLobby(this);
    player.team = team;

    return true;
  }

  changeTeam(player) {
    const currentTeam = player.team;
    const enemyTeam =
      currentTeam === DOTA_TEAM_GOODGUYS
        ? DOTA_TEAM_BADGUYS
        : DOTA_TEAM_GOODGUYS;

    const numEnemyTeam = this.getPlayersOnTeam(enemyTeam).length;

    if (numEnemyTeam < 3) {
      player.team = enemyTeam;
      return true;
    }

    return false;
  }

  removePlayer(player) {
    if (!this.contains(player)) return false;

    // remove the player from the list of players
    this.players = this.players.filter((p) => p.steamID !== player.steamID);
    player.leaveLobby();

    // if this was the last player, destroy the lobby;
    if (this.numPlayers === 0) {
      return true;
    }

    // if the host left, make another player the host
    if (player.isHost) {
      this.players[0].isHost = true;
    }

    return true;
  }

  /**
   * @returns {Player[]}
   */
  getPlayers() {
    return this.players;
  }

  numPlayers() {
    return this.players.length;
  }

  // TODO: Better password generation
  generatePassword() {
    return (Math.random().toString(36) + "00000000000000000").slice(2, 7);
  }

  /**
   * Sends all connected players the updated lobby
   */
  sendLobbyChangedMessage() {
    this.sendMessage("lobby_changed", this.players);
  }

  /**
   * Send a message to all players in the lobby
   */
  sendMessage(event, data) {
    const msg = JSON.stringify({ event, data });
    for (const player of this.players) {
      const client = player.ws;
      if (client && client != ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }

  /**
   * Send a message sourced from a player to all players
   * except the sender
   * @param {Player} sendingPlayer
   * @param {string} event
   * @param {Object} data
   */
  sendMessageFromPlayer(sendingPlayer, event, data) {
    const ws = sendingPlayer.ws;
    data = {
      ...data,
      player: sendingPlayer,
    };
    const msg = JSON.stringify({ event, data });
    for (const player of this.players) {
      const client = player.ws;
      // send the data to all other clients in lobby with open WS
      if (client && client != ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }
}

module.exports = Lobby;
