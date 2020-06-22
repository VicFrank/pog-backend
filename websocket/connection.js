const lobbies = require("../matchmaking/lobbies");
const lobbyPlayers = require("../matchmaking/lobby-players");
const connectionManager = require("./connectionManager");

const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
  LOBBY_LOCK_TIME,
} = require("../common/constants");
const { getLobby } = require("../matchmaking/lobby-players");

(async function () {
  runTests();
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

  // console.log("running tests");

  // await leaveLobby(player1);
  // await leaveLobby(player2);
  // await leaveLobby(player3);
  // await leaveLobby(player4);
  // await leaveLobby(player5);
  // await leaveLobby(player6);

  // const lobbyID = await makeLobby(player1, null, "US West");

  // await joinLobby(player2, lobbyID, null);
  // await joinLobby(player3, lobbyID, null);
  // await joinLobby(player4, lobbyID, null);
  // await joinLobby(player5, lobbyID, null);

  // sendChatToLobby(player1, "hey");

  // console.log("run tests");
}

/*
  Handle the different websocket events
*/
async function sendInitialData(steamID) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  const player = await lobbyPlayers.getPlayer(steamID);

  let lobby_players;
  if (lobby) {
    // If they're in a lobby, send them the lobby info
    lobby_players = await lobbies.getLobbyPlayers(lobby.lobby_id);

    const data = {
      event: "connected",
      data: {
        player,
        lobby_players,
        lobby,
      },
    };

    connectionManager.sendMessageToPlayer(steamID, data);
  } else {
    // Otherwise, send the list of lobbies
    const lobbyList = await lobbies.getAllLobbies();
    const data = {
      event: "connected",
      data: {
        lobbyList,
      },
    };

    connectionManager.sendMessageToPlayer(steamID, data);
  }
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

function sendError(steamID, errorMessage) {
  const data = {
    event: "error",
    data: errorMessage,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function makeLobby(steamID, avatar, region) {
  // TODO: MMR ranges
  const minRank = 0;
  const maxRank = 0;

  // check to see if the player can make this lobby
  const inLobby = await lobbyPlayers.inLobby(steamID);
  if (inLobby) {
    console.log("Can't Make a new lobby, Player is already in a lobby");
    sendError(steamID, "already_in_lobby");
    return;
  }

  return await lobbies.makeLobby(steamID, avatar, region, minRank, maxRank);
}

async function updateLobbyPlayers(lobbyID) {
  const lobby_players = await lobbies.getLobbyPlayers(lobbyID);

  const data = {
    event: "lobby_changed",
    data: lobby_players,
  };
  connectionManager.sendMessageToLobby(lobbyID, data);
}

async function joinLobby(steamID, lobbyID, avatar) {
  const lobby = await lobbies.getLobby(lobbyID);
  const player = await lobbyPlayers.getPlayer(steamID);

  const inLobby = await lobbyPlayers.inLobby(steamID);
  if (inLobby) {
    console.log("Can't Join lobby, Player is already in a lobby");
    sendError(steamID, "already_in_lobby");
    return;
  }

  if (!lobby) {
    console.log("Lobby no longer exists");
    sendError(steamID, "lobby_doesnt_exist");
    return;
  }

  const isFull = await lobbies.isFull(lobbyID);
  if (isFull) {
    console.log("Lobby is full");
    sendError(steamID, "lobby_full");
    return;
  }

  // TODO: Check if player meets mmr requirements
  const meetsRequirements = true;
  if (!meetsRequirements) {
    console.log("You don't meet the lobby requirements");
    sendError(steamID, "failed_lobby_requirements");
    return;
  }

  const isLocked = await lobbies.isLobbyLocked(lobbyID);
  if (isLocked) {
    console.log("Can't leave, Lobby is locked");
    sendError(steamID, "lobby_locked");
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
  updateLobbyPlayers(lobbyID);
}

async function leaveLobby(steamID) {
  // Make sure the player is in the lobby
  const player = await lobbyPlayers.getPlayer(steamID);
  if (!player || !player.lobby_id) return;

  const lobbyID = player.lobby_id;

  // You can't leave if the lobby is locked
  const isLocked = await lobbies.isLobbyLocked(lobbyID);
  if (isLocked) {
    sendError(steamID, "lobby_locked");
    return;
  }

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
  if (lobbySize == 0) {
    deleteLobby(lobbyID);
    return;
  }

  // If the host left, choose a new host
  if (player.is_host) {
    lobbies.updateHost(lobbyID);
  }

  updateLobbyPlayers(lobbyID);
}

async function deleteLobby(lobbyID) {
  const data = {
    event: "left_lobby",
  };

  // inform all remaining players that they've left the lobby
  // await to make sure we get the lobby players before it's destroyed
  await connectionManager.sendMessageToLobby(lobbyID, data);
  lobbies.deleteLobby(lobbyID);
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

  updateLobbyPlayers(lobbyID);
}

function generatePassword() {
  return (Math.random().toString(36) + "00000000000000000").slice(2, 7);
}

async function onLobbyFull(lobbyID) {
  // Make sure the lobby is full (this may be redundant)
  const isFull = await lobbies.isFull(lobbyID);
  if (!isFull) return;

  // Lock the lobby
  await lobbies.lockLobby(lobbyID);

  connectionManager.sendMessageToLobby(lobbyID, {
    event: "lobby_locked",
    data: true,
  });

  // Send the password
  const password = generatePassword();
  const data = {
    event: "password",
    data: password,
  };
  lobbies.setLobbyPassword(lobbyID, password);

  connectionManager.sendMessageToLobby(lobbyID, data);

  // TODO: After 5 minutes, unlock the lobby
  setTimeout(() => {
    unlockLobby(lobbyID);
  }, LOBBY_LOCK_TIME * 1000);
}

async function unlockLobby(lobbyID) {
  // Make sure the lobby still exists
  const lobby = await lobbies.getLobby(lobbyID);
  if (!lobby) return;

  await lobbies.unlockLobby(lobbyID);

  connectionManager.sendMessageToLobby(lobbyID, {
    event: "lobby_locked",
    data: false,
  });
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
    // TODO: Remove player from the lobby if they've been disconnected
    // long enough
    console.log(`Websocket Closed: ${username} ${steamID}`);

    connectionManager.removeConnection(steamID);
  });
};
