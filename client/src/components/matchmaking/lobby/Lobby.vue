<template>
  <div>
    <h1 class="blue">Lobby</h1>
    <PlayersList />
    <Chat />
    <b-button variant="secondary" class="mt-3" @click="leaveLobby">
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
  }
};
</script>

<style>
</style>