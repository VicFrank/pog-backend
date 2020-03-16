<template>
  <div class="main-layout__content">
    <div class="container">
      <h1 class="page-title">Games</h1>
      <PlayerGamesList v-bind:games="games"></PlayerGamesList>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "../games/PlayerGamesList.vue";

export default {
  components: {
    PlayerGamesList,
  },

  data: () => ({
    error: "",
    games: [],
  }),

  created() {
    fetch(`/api/players/${this.$route.params.steam_id}/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
  },
};
</script>

<style></style>
