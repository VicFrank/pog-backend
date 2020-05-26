const redis = require("redis");

const lobbies = require("../matchmaking/lobbies");

let connections = {};

/*
  Handle sending websocket messages to all connected node clients
*/
const pubClient = redis.createClient();
const subClient = redis.createClient();

subClient.subscribe("ws_broadcast");

subClient.on("message", (channel, message) => {
  console.log(`Message "${message}" on channel "${channel}" arrived!`);
  const { steamID, payload } = JSON.parse(message);

  // Send the message to the player, if they exist on this cluster
  if (connections[steamID]) {
    const ws = connections[steamID];
    ws.send(payload);
  }
});

function broadcastMessage(steamID, payload) {
  const message = JSON.stringify({
    steamID,
    payload,
  });
  pubClient.publish("ws_broadcast", message);
}

module.exports = {
  addConnection(steamID, ws) {
    connections[steamID] = ws;
  },

  removeConnection(steamID) {
    delete connections[steamID];
  },

  sendMessageToPlayer(steamID, message) {
    broadcastMessage(steamID, message);
  },

  async sendMessageToLobby(lobbyID, message) {
    const players = await lobbies.getLobbyPlayers(lobbyID);

    for (const player of players) {
      const steamID = player.steam_id;
      broadcastMessage(steamID, message);
    }
  },

  async sendMessageFromPlayer(steamID, lobbyID, message) {
    const players = await lobbies.getLobbyPlayers(lobbyID);

    for (const player of players) {
      if (steamID !== player.steam_id) {
        broadcastMessage(player.steam_id, message);
      }
    }
  },
};
