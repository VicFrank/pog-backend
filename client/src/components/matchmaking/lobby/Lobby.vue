<template>
  <div>
    <h1 class="blue">
      Lobby
      <template v-if="locked">
        <i class="fas fa-lock mx-1"></i>
      </template>
    </h1>
    <p
      v-if="locked"
      class="text-muted"
    >Lobby is locked for another {{ lockTimeRemaining | hhmmss }} seconds</p>
    <h2 v-if="lobbyPassword">
      <span class="text-muted">Password:</span>
      {{ lobbyPassword }}
    </h2>
    <p
      v-if="lobbyPassword && isHost"
      class="text-muted"
    >As the host, it is your job to create the lobby</p>
    <PlayersList />
    <Chat />
    <b-button :disabled="locked" variant="secondary" class="mt-3" @click="leaveLobby">
      <i class="fas fa-times mr-1"></i>Leave
    </b-button>
  </div>
</template>

<script>
import PlayersList from "./PlayersList";
import Chat from "./Chat";
export default {
  components: {
    PlayersList,
    Chat
  },
  methods: {
    leaveLobby() {
      this.$store.dispatch("attemptLeave");
    }
  },
  created() {
    window.scrollTo(0, 0);
  },
  computed: {
    locked() {
      return this.$store.getters.isLobbyLocked;
    },
    lobbyPassword() {
      return this.$store.getters.lobbyPassword;
    },
    isHost() {
      return this.$store.getters.isHost;
    },
    lockTimeRemaining() {
      return this.$store.getters.lockTimeRemaining;
    }
  }
};
</script>

<style></style>
