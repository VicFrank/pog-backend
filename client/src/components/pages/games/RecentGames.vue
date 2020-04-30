<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Recent Matches</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="match-history">
              <table class="table">
                <tbody>
                  <tr>
                    <td class="tb-head" scope="col">Date</td>
                    <td class="tb-head" scope="col">Result</td>
                    <td class="tb-head" scope="col">Duration</td>
                    <td class="tb-head" scope="col">Lorekeepers</td>
                    <td class="tb-head" scope="col">Flameguard</td>
                  </tr>
                  <template v-if="loading">
                    <tr v-for="i in 100" :key="i">
                      <td />
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  </template>
                  <template v-else>
                    <router-link
                      v-for="game in games"
                      :key="game.game_id"
                      :to="'/games/' + game.game_id"
                      tag="tr"
                    >
                      <td>
                        <div class="light-text">
                          {{ game.created_at | dateFromNow }}
                        </div>
                      </td>
                      <td>
                        <span v-if="game.radiant_win" class="win"
                          >Lorekeepers Victory</span
                        >
                        <span v-else class="loss">Flameguard Victory</span>
                      </td>
                      <td>{{ game.duration | hhmmss }}</td>
                      <td>
                        <HeroImage
                          v-for="(hero, index) in game.radiant"
                          :key="index"
                          :hero="hero"
                          class="hero-image"
                        ></HeroImage>
                      </td>
                      <td>
                        <HeroImage
                          v-for="(hero, index) in game.dire"
                          :key="index"
                          :hero="hero"
                          class="hero-image"
                        ></HeroImage>
                      </td>
                    </router-link>
                  </template>
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
import HeroImage from "./HeroImage.vue";

export default {
  data: () => ({
    page: 1,
    itemsPerPage: 15,
    games: [],
    loading: true,
  }),

  components: {
    HeroImage,
  },

  created() {
    fetch(`/api/games`)
      .then((res) => res.json())
      .then((games) => {
        this.loading = false;
        this.games = games;
      });
  },
};
</script>

<style scoped>
tr {
  cursor: pointer;
  height: 31px;
  width: 1109px;
}

tr:hover {
  background-color: #324250;
}

.hero-image {
  height: 30px;
  padding: 2px;
}
</style>
