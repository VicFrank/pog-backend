<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title" v-t="'profile.my_stats'"></h1>
      <div class="container">
        <div v-if="loading" class="d-flex justify-content-center mb-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
        <div class="row">
          <div class="col-xl-12">
            <div class="my-stats">
              <table class="table">
                <tbody>
                  <tr>
                    <td class="tb-head">{{ $t("profile.mmr") }}</td>
                    <td class="tb-head">{{ $t("profile.wins") }}</td>
                    <td class="tb-head">{{ $t("profile.losses") }}</td>
                    <td class="tb-head">{{ $t("profile.abandoned") }}</td>
                    <td class="tb-head">{{ $t("profile.time_played") }}</td>
                  </tr>
                  <tr>
                    <td>{{ playerStats.mmr }}</td>
                    <td>{{ playerStats.wins }}</td>
                    <td>{{ playerStats.losses }}</td>
                    <td>{{ playerStats.abandoned }}</td>
                    <td>{{ playerStats.time_played | duration }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Records :steamID="steamID" />
        <h3
          v-if="bpTier === 3"
          class="page-title"
          v-t="'profile.hero_stats'"
        ></h3>
        <PlayerHeroStatsList :steamID="steamID" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerHeroStatsList from "./games/PlayerHeroStatsList";
import Records from "./games/Records";

export default {
  components: {
    PlayerHeroStatsList,
    Records,
  },

  data: () => ({
    error: "",
    playerStats: {},
    loading: true,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    bpTier() {
      return this.$store.getters.bpTier;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
      });
  },
};
</script>

<style></style>
