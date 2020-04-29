<template>
  <div class="main-layout__content">
    <div class="content">
      <div class="container" v-if="playerStats.username">
        <h1>{{ playerStats.username }}</h1>
        <div class="row">
          <div class="col-xl-12">
            <div class="match-history position-relative">
              <h3 class="mt-5 mb-5 text-center">Match History</h3>

              <PlayerGamesList v-bind:games="games" loading="gamesLoading"></PlayerGamesList>

              <div class="more">
                <router-link :to="`/players/${$route.params.steam_id}/games`" class="blue">View All</router-link>
              </div>
            </div>

            <div class="my-stats position-relative">
              <h3 class="mt-5 mb-5 text-center">Stats</h3>
              <table class="table mb-5">
                <tbody>
                  <tr>
                    <td class="tb-head">wins</td>
                    <td class="tb-head">losses</td>
                    <td class="tb-head">abandoned</td>
                    <td class="tb-head">time played</td>
                  </tr>
                  <tr>
                    <td>{{ playerStats.wins }}</td>
                    <td>{{ playerStats.losses }}</td>
                    <td>{{ playerStats.abandoned }}</td>
                    <td>{{ playerStats.time_played | hhmmss }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <h2>Player not found</h2>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "../games/PlayerGamesList.vue";

export default {
  components: {
    PlayerGamesList
  },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    gamesLoading: true
  }),

  created() {
    const steamID = this.$route.params.steam_id;

    fetch(`/api/players/${steamID}/games?limit=3`)
      .then(res => res.json())
      .then(games => {
        this.gamesLoading = false;
        this.games = games;
      });

    fetch(`/api/players/${steamID}/`)
      .then(res => res.json())
      .then(playerStats => {
        this.playerStats = playerStats;
      });
  }
};
</script>

<style></style>
