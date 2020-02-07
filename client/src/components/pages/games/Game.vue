<template>
  <div class="main-layout__content">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="match-history">
            <h2 class="mb-5 radiant-color">The Radiant</h2>
            <TeamGameStats v-bind:players="radiantPlayers"></TeamGameStats>
            <h2 class="mt-5 mb-5 dire-color">The Dire</h2>
            <TeamGameStats v-bind:players="direPlayers"></TeamGameStats>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamGameStats from "./TeamGameStats.vue";

export default {
  components: {
    TeamGameStats,
  },

  data: () => ({
    error: "",
    radiantPlayers: [],
    direPlayers: [],
    radiantWin: Boolean,
    duration: Number,
    date: String,
  }),

  mounted() {
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then(res => res.json())
      .then(gameData => {
        this.radiantPlayers = gameData.playerInfo.filter(
          player => player.is_radiant
        );
        this.direPlayers = gameData.playerInfo.filter(
          player => !player.is_radiant
        );
        this.duration = gameData.gameInfo.duration;
        this.date = gameData.gameInfo.created_at;
      });
  },
};
</script>

<style></style>
