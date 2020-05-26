<template>
  <div>
    <h1 class="blue">Lobby</h1>
    <PlayersList />
    <Chat />
  </div>
</template>

<script>
import PlayersList from "./PlayersList";
import Chat from "./Chat";
export default {
  components: {
    PlayersList,
    Chat
  }
};
</script>

<style>
</style>