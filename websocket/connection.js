const lobbies = require("../matchmaking/lobbies");
const lobbyPlayers = require("../matchmaking/lobby-players");
const connectionManager = require("./connectionManager");

const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
} = require("../common/constants");

(async function () {
  // runTests();
})();

async function runTests() {
  const steamIDs = [
    "76561197960956468",
    "76561197964547457",
    "76561198014254115",
    "76561197960287930",
    "76561198052211234",
    "76561198015161808",
    "76561198007141460",
  ];

  const player1 = steamIDs[0];
  const player2 = steamIDs[1];
  const player3 = steamIDs[2];
  const player4 = steamIDs[3];
  const player5 = steamIDs[4];
  const player6 = steamIDs[5];
  const player7 = steamIDs[6];

  // await makeLobby(player1, null, "US West");
  // await makeLobby(player7, null, "US East");

  sendChatToLobby(player1, "hey");
  sendChatToLobby(player7, "hey");

  console.log("run tests");
}

/*
  Handle the different websocket events
*/
async function sendInitialData(steamID) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  const player = await lobbyPlayers.getPlayer(steamID);

  let lobby_players;
  if (lobby) {
    lobby_players = await lobbies.getLobbyPlayers(lobby.lobby_id);
  }

  const data = {
    event: "connected",
    data: {
      player,
      lobby_players,
    },
  };

  connectionManager.sendMessageToPlayer(steamID, data);
}

async function sendChatToLobby(steamID, message) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  if (!lobby) return;
  const lobbyID = lobby.lobby_id;

  const player = await lobbyPlayers.getPlayer(steamID);

  const data = {
    event: "chat",
    data: {
      username: player.username,
      message,
    },
  };

  connectionManager.sendMessageFromPlayer(steamID, lobbyID, data);
}

async function sendLobbyList(steamID) {
  const lobbyList = await lobbies.getAllLobbies();
  const data = {
    event: "lobbies_list",
    data: lobbyList,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function makeLobby(steamID, avatar, region) {
  const minRank = 0;
  const maxRank = 0;

  // check to see if the player can make this lobby
  const player = await lobbyPlayers.getPlayer(steamID);
  if (player && player.lobby_id) return;

  lobbies.makeLobby(steamID, avatar, region, minRank, maxRank);
}

async function joinLobby(steamID, lobbyID, avatar) {
  const lobby = await lobbies.getLobby(lobbyID);

  // Check if lobby exists
  if (!lobby) {
    console.log("Lobby no longer exists");
    return;
  }

  // Check if lobby is full
  const isFull = await lobbies.isFull(lobbyID);
  if (isFull) {
    console.log("Lobby is full");
    return;
  }

  // TODO: Check if player meets mmr requirements
  const meetsRequirements = true;
  if (!meetsRequirements) {
    console.log("You don't meet the lobby requirements");
    return;
  }

  // Figure out what team to put us on
  let team = DOTA_TEAM_GOODGUYS;
  const radiantPlayers = lobbies.getNumPlayersOnTeam(DOTA_TEAM_GOODGUYS);
  if (radiantPlayers >= 3) {
    team = DOTA_TEAM_BADGUYS;
  }

  await lobbyPlayers.joinLobby(steamID, lobbyID, team, avatar);

  // If the lobby is now full, send them the password
  if (await lobbies.isFull(lobbyID)) {
    onLobbyFull(lobbyID);
  }

  const lobby_players = await lobbies.getLobbyPlayers(lobbyID);

  const data = {
    event: "join_lobby",
    data: lobby_players,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function leaveLobby(steamID) {
  const player = await lobbyPlayers.getPlayer(steamID);
  if (!player || !player.lobby_id) return;

  const lobbyID = player.lobby_id;

  const data = {
    event: "left_lobby",
    data: steamID,
  };

  await lobbyPlayers.leaveLobby(steamID);

  // Inform the lobby that a player left
  connectionManager.sendMessageToLobby(lobbyID, data);
  // Confirm to the player that they left
  connectionManager.sendMessageToPlayer(steamID, data);

  // Destroy the lobby if it is now empty
  const lobbySize = await lobbies.getLobbySize(lobbyID);
  console.log("Lobby size", lobbySize);
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
    data: {
      steamID,
      enemyTeam,
    },
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
    data: password,
  };
  connectionManager.sendMessageToLobby(lobbyID, data);
}

module.exports = connection = (ws, user) => {
  ws.isAlive = true;

  const username = user.displayName;
  const steamID = user.id;
  let avatar;
  if (user.photos && user.photos[0]) avatar = user.photos[0].value;

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
      case "connected":
        sendInitialData(steamID);
        break;
      case "pong":
        ws.isAlive = true;
        break;
      case "chat":
        // Send a message to the chat lobby
        const chatMessage = data.message;
        sendChatToLobby(steamID, chatMessage);
        break;
      case "refresh_lobbies":
        sendLobbyList(steamID);
        break;
      case "join_lobby":
        const lobbyID = data;
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
        makeLobby(steamID, avatar, region);
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
