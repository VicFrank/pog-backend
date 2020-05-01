<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Heroes</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="match-history">
              <b-table hover :fields="fields" :items="heroes" responsive>
                <template v-slot:cell(hero)="data">
                  <div class="hero-col">
                    <HeroImage class="hero-image" :hero="data.item.hero"></HeroImage>
                    {{ data.item.hero | translateDota }}
                  </div>
                </template>
                <template v-slot:cell(win_rate)="data">{{data.item.win_rate | round(2) }}</template>
                <template v-slot:cell(kdr)="data">{{data.item.kdr | round(2) }}</template>
              </b-table>
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
    fields: [
      {
        key: "hero",
        sortable: true,
        thClass: "table-head"
      },
      {
        key: "games",
        sortable: true,
        thClass: "table-head"
      },
      {
        key: "win_rate",
        sortable: true,
        thClass: "table-head"
      },
      {
        key: "kdr",
        sortable: true,
        thClass: "table-head",
        label: "KDR"
      }
    ],
    heroes: []
  }),

  components: {
    HeroImage
  },

  created() {
    fetch(`/api/games/stats/heroes`)
      .then(res => res.json())
      .then(heroes => {
        this.heroes = heroes.map(stats => ({
          hero: stats.hero,
          games: stats.games,
          win_rate: stats.wins / stats.games,
          kdr: stats.avg_kills / stats.avg_deaths
        }));
      });
  }
};
</script>

<style scoped>
/* tr {
  cursor: default;
}

tr:hover {
  background-color: #324250;
} */

.hero-image {
  height: 40px;
  margin-right: 1em;
}

.hero-col {
  text-align: left;
  padding: 0.75rem;
}

thead tr {
  background-color: #5f7286;
}

.table-head {
  font-family: "Radiance-Semibold";
  font-size: 14px;
  font-weight: 600;
  color: #0b86c4;
  padding: 1.5em !important;
  text-transform: uppercase;
  letter-spacing: 0.75px;
}
</style>
