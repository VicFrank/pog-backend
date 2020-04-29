<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">My Stats</h1>
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
                    <td class="tb-head">mmr</td>
                    <td class="tb-head">poggers</td>
                    <td class="tb-head">wins</td>
                    <td class="tb-head">losses</td>
                    <td class="tb-head">abandoned</td>
                    <td class="tb-head">time played</td>
                  </tr>
                  <tr>
                    <td>{{ playerStats.mmr }}</td>
                    <td>{{ playerStats.poggers }}</td>
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
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    playerStats: {},
    loading: true
  }),

  created() {
    fetch(`/api/players/${this.$store.state.auth.userSteamID}/`)
      .then(res => res.json())
      .then(playerStats => {
        this.loading = false;
        this.playerStats = playerStats;
      });
  }
};
</script>

<style></style>
