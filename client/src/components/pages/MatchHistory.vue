<template>
  <div class="main-layout__content">
    <div class="container">
      <h1 class="page-title">My Games</h1>
      <PlayerGamesList v-bind:games="games"></PlayerGamesList>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "./games/PlayerGamesList.vue";

export default {
  components: {
    PlayerGamesList,
  },

  data: () => ({
    error: "",
    games: [],
  }),

  mounted() {
    fetch(`/api/players/${this.$store.state.auth.userSteamID}/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
  },
};
</script>

<style></style>
