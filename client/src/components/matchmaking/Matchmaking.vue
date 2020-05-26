<template>
  <div class="container">
    <template v-if="!inLobby">
      <h1>Matchmaking</h1>
      <HostLobby />
      <LobbyList />
    </template>
    <template v-else>
      <Lobby />
    </template>
  </div>
</template>

<script>
import LobbyList from "./lobbies/LobbyList";
import HostLobby from "./buttons/HostLobby";
import Lobby from "./lobby/Lobby";

export default {
  components: {
    LobbyList,
    HostLobby,
    Lobby
  },

  computed: {
    inLobby() {
      return this.$store.getters.inLobby;
    }
  }
};
</script>

<style></style>
