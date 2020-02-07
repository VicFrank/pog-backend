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
                  <td class="tb-head" scope="col">Radiant</td>
                  <td class="tb-head" scope="col">Dire</td>
                </tr>
                <router-link
                  v-for="game in games"
                  :key="game.game_id"
                  :to="'/demo/games/' + game.game_id"
                  tag="tr"
                >
                  <td>
                    <div class="light-text">
                      {{ game.created_at | dateFromNow }}
                    </div>
                  </td>
                  <td>
                    <span v-if="game.radiant_win" class="win">Radiant Victory</span>
                    <span v-else class="loss">Dire Victory</span>
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
  }),

  components: {
    HeroImage,
  },

  mounted() {
    fetch(`/api/games`)
      .then(res => res.json())
      .then(games => {
        this.games = games;
      });
  },
};
</script>

<style>
tr {
  cursor: pointer;
}

tr:hover {
  background-color: #324250;
}

.hero-image {
  height: 30px;
  padding: 2px;
}
</style>
