<template>
  <div class="row">
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div class="col-xl-12">
      <div class="my-stats">
        <table class="table">
          <tbody>
            <tr>
              <td class="tb-head">{{ $t("profile.longest_game") }}</td>
              <td class="tb-head">{{ $t("profile.most_kills") }}</td>
              <td class="tb-head">{{ $t("profile.most_lh") }}</td>
              <td class="tb-head">{{ $t("profile.most_damage") }}</td>
              <td class="tb-head">{{ $t("profile.biggest_upset") }}</td>
            </tr>
            <tr>
              <td>
                <router-link :to="`/games/${playerStats.duration_id}`">{{
                  playerStats.longest_game | duration
                }}</router-link>
              </td>
              <td>
                <router-link :to="`/games/${playerStats.kills_game_id}`">{{
                  playerStats.most_kills
                }}</router-link>
              </td>
              <td>
                <router-link :to="`/games/${playerStats.lh_game_id}`">{{
                  playerStats.most_lh
                }}</router-link>
              </td>
              <td>
                <router-link :to="`/games/${playerStats.damage_game_id}`">{{
                  playerStats.most_hero_damage
                }}</router-link>
              </td>
              <td>
                <router-link :to="`/games/${playerStats.upset_game_id}`"
                  >+{{ playerStats.biggest_upset }} mmr</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steamID: String,
  },

  data: () => ({
    error: "",
    playerStats: {},
    loading: true,
  }),

  created() {
    fetch(`/api/players/${this.steamID}/records`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
      });
  },
};
</script>

<style>
</style>