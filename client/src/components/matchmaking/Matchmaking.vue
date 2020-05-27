<template>
  <div class="container">
    <div v-if="initialLoading">Waiting for initial websocket response</div>
    <b-button @click="testRefresh">Refresh Connection</b-button>
    <template v-if="loggedIn">
      <template v-if="!inLobby">
        <Lobbies />
      </template>
      <template v-else>
        <Lobby />
      </template>
    </template>
    <template v-else>You need to log in, dog</template>
  </div>
</template>

<script>
import Lobbies from "./Lobbies";
import Lobby from "./lobby/Lobby";

export default {
  components: {
    Lobbies,
    Lobby
  },

  computed: {
    initialLoading() {
      return this.$store.getters.initialLoading;
    },
    inLobby() {
      return this.$store.getters.inLobby;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  },

  methods: {
    testRefresh() {
      this.$store.dispatch("refreshConnection");
    }
  }
};
</script>

<style></style>
