<template>
  <div class="main-layout__content">
    <div class="content">
      <div class="container" v-if="!playerNotFound">
        <h1>{{ playerStats.username }}</h1>
        <div class="row">
          <div class="col-xl-12">
            <div class="match-history position-relative">
              <h3
                class="mt-5 mb-5 text-center"
                v-t="'profile.match_history'"
              ></h3>

              <PlayerGamesList
                v-bind:games="games"
                :loading="gamesLoading"
              ></PlayerGamesList>

              <div class="more">
                <router-link
                  :to="`/players/${$route.params.steam_id}/games`"
                  class="blue"
                  >View All</router-link
                >
              </div>
            </div>

            <div class="my-stats position-relative">
              <h3 class="mt-5 mb-5 text-center" v-t="'profile.stats'"></h3>
              <table class="table mb-5">
                <tbody>
                  <tr>
                    <td class="tb-head">{{ $t("profile.wins") }}</td>
                    <td class="tb-head">{{ $t("profile.losses") }}</td>
                    <td class="tb-head">{{ $t("profile.abandoned") }}</td>
                    <td class="tb-head">{{ $t("profile.time_played") }}</td>
                  </tr>
                  <tr>
                    <td>{{ playerStats.wins }}</td>
                    <td>{{ playerStats.losses }}</td>
                    <td>{{ playerStats.abandoned }}</td>
                    <td>{{ playerStats.time_played | duration }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="position-relative" v-if="bpTier >= 2">
              <Records :steamID="steamID" />
              <h3 class="mt-5 mb-5 text-center" v-t="'profile.hero_stats'"></h3>
              <PlayerHeroStatsList :steamID="steamID" />
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <h2 v-t="'profile.not_found'"></h2>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "../games/PlayerGamesList";
import PlayerHeroStatsList from "../games/PlayerHeroStatsList";
import Records from "../games/Records";

export default {
  components: {
    PlayerGamesList,
    PlayerHeroStatsList,
    Records,
  },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    gamesLoading: true,
    playerNotFound: false,
  }),

  computed: {
    steamID() {
      return this.$route.params.steam_id;
    },
    bpTier() {
      return this.$store.getters.bpTier;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/games?limit=3`)
      .then((res) => res.json())
      .then((games) => {
        this.gamesLoading = false;
        this.games = games;
      });

    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        if (!playerStats.steam_id) {
          this.playerNotFound = true;
        }
        this.playerStats = playerStats;
      });
  },
};
</script>

<style></style>
