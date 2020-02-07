<template>
<div class="main-layout__content">
  <div class="content">
    <h1 class="page-title">Heroes</h1>
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="match-history">
            <table class="table">
              <tbody>
                <tr>
                  <td class="tb-head" scope="col">Hero</td>
                  <td class="tb-head" scope="col">Games</td>
                  <td class="tb-head" scope="col">Win Rate</td>
                  <td class="tb-head" scope="col">Avg KDR</td>
                </tr>
                <tr
                  v-for="hero in heroes"
                  :key="hero.hero"
                >
                  <th scope="row">
                    <HeroImage
                      :hero="hero.hero"
                    ></HeroImage>
                    {{hero.hero | translateDota}}
                  </th>
                  <td>
                    {{ hero.games }}
                  </td>
                  <td>{{ (hero.wins/hero.games) | percentage(2) }}</td>
                  <td>
                    {{ (hero.avg_kills/hero.avg_deaths) | round(2) }}
                  </td>
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
import HeroImage from "./HeroImage.vue";

export default {
  data: () => ({
    page: 1,
    itemsPerPage: 15,
    heroes: [],
  }),

  components: {
    HeroImage,
  },

  mounted() {
    fetch(`/api/games/stats/heroes`)
      .then(res => res.json())
      .then(heroes => {
        this.heroes = heroes;
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
