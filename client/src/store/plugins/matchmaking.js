const scheme = window.location.protocol === "https:" ? "wss" : "ws";
const connection = new WebSocket(
  `${scheme}://${window.location.hostname}:3000`
);

function isOpen() {
  return connection.readyState === connection.OPEN;
}

export default function createWebSocketPlugin() {
  return (store) => {
    connection.onopen = (e) => {
      console.log("Successfully connected", e);
      store.dispatch("connectionOpened");
    };

    connection.onmessage = (e) => {
      try {
        const { event, data } = JSON.parse(e.data);

        console.log("from server:");
        console.log(event, data);

        switch (event) {
          case "join_lobby":
            store.dispatch("joinLobby", data);
            break;
          case "left_lobby":
            store.dispatch("leaveLobby", data);
            break;
          case "lobby_changed":
            store.dispatch("updateLobbyPlayers", data);
            break;
          case "chat":
            store.dispatch("addMessage", data);
            break;
          case "lobbies":
            store.dispatch("setLobbies", data.lobbyList);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };

    store.subscribe((mutation, state) => {
      if (!isOpen()) {
        console.log("Websocket is closed");
        return;
      }
      if (!state.matchmaking.connected) {
        console.log("Not connected");
        return;
      }

      const inLobby = state.matchmaking.inLobby;
      const data = mutation.payload;

      console.log(mutation);

      // Send a chat message
      if (inLobby && mutation.type === "SEND_MESSAGE") {
        const msg = JSON.stringify({ event: "chat", data });
        connection.send(msg);
      }

      // Make and join a new lobby
      if (!inLobby && mutation.type === "HOST_LOBBY") {
        const msg = JSON.stringify({ event: "make_lobby", data });
        connection.send(msg);

        store.dispatch("hostedLobby");
      }

      if (!inLobby && mutation.type === "JOIN_LOBBY") {
        const msg = JSON.stringify({ event: "join_lobby", data });
        connection.send(msg);
      }

      if (inLobby && mutation.type === "LEAVE_LOBBY") {
        const msg = JSON.stringify({ event: "leave_lobby", data });
        connection.send(msg);
      }

      if (mutation.type === "REFRESH_LOBBIES") {
        const msg = JSON.stringify({ event: "refresh_lobbies" });
        connection.send(msg);
      }
    });
  };
}
