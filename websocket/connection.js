const lobbies = require("../matchmaking/lobbies");
const lobbyPlayers = require("../matchmaking/lobby-players");
const connectionManager = require("./connectionManager");

const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
} = require("../common/constants");

(async function () {
  // const lobbyList = await lobbies.getAllLobbies();
  // console.log(lobbyList);
})();

/*
  Handle the different websocket events
*/
async function sendChatToLobby(steamID, message) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  if (!lobby) return;
  const lobbyID = lobby.lobby_id;

  const data = {
    event: "chat",
    source: player.getPlayerData(),
    message,
  };

  connectionManager.sendMessageFromPlayer(steamID, lobbyID, data);
}

async function sendLobbyList(steamID) {
  const lobbyList = await lobbies.getAllLobbies();
  const data = {
    event: "lobbies",
    lobbyList,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function makeLobby(steamID, region) {
  const minRank = 0;
  const maxRank = 0;

  // check to see if the player can make this lobby
  const player = await lobbyPlayers.getPlayer(steamID);
  if (player && player.lobby_id) return;

  lobbies.makeLobby(steamID, region, minRank, maxRank);
}

async function joinLobby(steamID, lobbyID, avatar) {
  const lobby = await lobbies.getLobby(lobbyID);

  // Check if lobby exists
  if (!lobby) return;

  // Check if lobby is full
  const isFull = await lobbies.isFull(lobbyID);
  if (isFull) return;

  // TODO: Check if player meets mmr requirements
  const meetsRequirements = true;
  if (!meetsRequirements) return;

  // Figure out what team to put us on
  let team = DOTA_TEAM_GOODGUYS;
  const radiantPlayers = lobbies.getNumPlayersOnTeam(DOTA_TEAM_GOODGUYS);
  if (radiantPlayers >= 3) {
    team = DOTA_TEAM_BADGUYS;
  }

  lobbyPlayers.joinLobby(steamID, lobbyID, team, avatar);

  // If the lobby is now full, send them the password
  onLobbyFull(lobbyID);

  const data = {
    event: "join_lobby",
    lobbyID,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function leaveLobby(steamID) {
  const player = await lobbyPlayers.getPlayer(steamID);
  if (!player || !player.lobby_id) return;

  const lobbyID = player.lobby_id;

  const data = {
    event: "left_lobby",
    steamID,
  };

  await lobbyPlayers.leaveLobby(lobbyID);

  // Inform the lobby that a player left
  connectionManager.sendMessageToLobby(lobbyID, data);
  // Confirm to the player that they left
  connectionManager.sendMessageToPlayer(steamID, data);

  // Destroy the lobby if it is now empty
  const lobbySize = await lobbies.getLobbySize(lobbyID);
  if (lobbySize == 0) {
    lobbies.deleteLobby(lobbyID);
    return;
  }

  // If the host left, choose a new host
  if (player.is_host) {
    lobbies.updateHost(lobbyID);
  }
}

function getEnemyTeam(team) {
  switch (team) {
    case DOTA_TEAM_GOODGUYS:
      return DOTA_TEAM_BADGUYS;
    case DOTA_TEAM_BADGUYS:
      return DOTA_TEAM_GOODGUYS;
  }
}

async function changeTeam(steamID) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  if (!lobby) return;

  // Make sure the enemy team isn't full
  const player = await lobbyPlayers.getPlayer(steamID);
  const team = player.team;
  const enemyTeam = getEnemyTeam(team);

  const numEnemyTeam = (numEnemyTeam = await lobbies.getNumPlayersOnTeam(
    enemyTeam
  ));

  if (numEnemyTeam >= 3) {
    return;
  }

  const data = {
    event: "team_changed",
    steamID,
    enemyTeam,
  };
  connectionManager.sendMessageToPlayer(lobby.lobbyID, data);
}

async function generatePassword() {
  return (Math.random().toString(36) + "00000000000000000").slice(2, 7);
}

function onLobbyFull(lobbyID) {
  // TODO: Wait for confirmation? Close the lobby?

  // Send the lobby the dota lobby password
  const password = generatePassword();
  const data = {
    event: "password",
    password,
  };
  connectionManager.sendMessageToLobby(lobbyID, data);
}

module.exports = connection = (ws, user) => {
  const username = user.displayName;
  const steamID = user.id;
  const avatar = user.photos[0].value;

  connectionManager.addConnection(steamID, ws);

  console.log(`Web Socket Connect: ${username} ${steamID}`);

  ws.on("message", (message) => {
    // Send a message to the user's current chat channel
    let event;
    let data;
    try {
      const parsedMessage = JSON.parse(message);
      event = parsedMessage.event;
      data = parsedMessage.data;
    } catch (error) {
      console.log("Error parsing websocket data", message);
      return;
    }

    console.log(`Received event ${event} from user ${username}`);

    switch (event) {
      case "chat":
        // Send a message to the chat lobby
        const chatMessage = data.message;
        sendChatToLobby(steamID, chatMessage);
        break;
      case "refresh_lobbies":
        sendLobbyList(steamID);
        break;
      case "join_lobby":
        const lobbyID = data.lobbyID;
        joinLobby(steamID, lobbyID, avatar);
        break;
      case "leave_lobby":
        leaveLobby(steamID);
        break;
      case "change_team":
        changeTeam(steamID);
        break;
      case "quick_join_lobby":
        // Try to find a lobby that matches the user's preferences
        break;
      case "make_lobby":
        const region = data.region;
        makeLobby(steamID, region);
        break;
    }
  });

  ws.on("error", function (error) {
    console.log(`Websocket Error: ${error}`);
  });

  ws.on("close", function () {
    // TODO: User has closed the websocket, remove them from their lobby
    console.log(`Websocket Closed: ${username} ${steamID}`);

    connectionManager.removeConnection(steamID);
  });
};
