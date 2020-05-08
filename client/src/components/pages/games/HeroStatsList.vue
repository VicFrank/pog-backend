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
                    {{ $t(`dota.${data.item.hero}`) }}
                  </div>
                </template>
                <template v-slot:cell(games)="data">
                  {{ data.item.games }}
                  <PercentBar :max="maxGames" :value="data.item.games" class="mt-1 progress-bar"></PercentBar>
                </template>
                <template v-slot:cell(win_rate)="data">
                  {{ data.item.win_rate | percentage(1) }}
                  <PercentBar :max="1" :value="data.item.win_rate" class="mt-1 progress-bar"></PercentBar>
                </template>
                <template v-slot:cell(kdr)="data">
                  {{ data.item.kdr | round(2) }}
                  <PercentBar :max="maxKDR" :value="data.item.kdr" class="mt-1 progress-bar"></PercentBar>
                </template>
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
import PercentBar from "../../utility/PercentBar";

export default {
  components: {
    HeroImage,
    PercentBar
  },

  data: () => ({
    fields: [],
    heroes: [],
    maxGames: 0,
    maxKDR: 0
  }),

  created() {
    this.fields = [
      {
        key: "hero",
        sortable: true,
        thClass: "table-head text-left",
        label: this.$i18n.t("tables.hero")
      },
      {
        key: "games",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.games")
      },
      {
        key: "win_rate",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.winrate")
      },
      {
        key: "kdr",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.kdr")
      }
    ];
    fetch(`/api/games/stats/heroes`)
      .then(res => res.json())
      .then(heroes => {
        this.heroes = heroes.map(stats => ({
          hero: stats.hero,
          games: stats.games,
          win_rate: stats.wins / stats.games,
          kdr: stats.avg_kills / stats.avg_deaths
        }));
        this.maxGames = this.getMaxArray(this.heroes, "games");
        this.maxKDR = this.getMaxArray(this.heroes, "kdr");
      });
  },

  methods: {
    getMaxArray(arr, property) {
      return arr.reduce(
        (max, b) => Math.max(max, b[property]),
        arr[0][property]
      );
    }
  }
};
</script>

<style scoped>
.progress-bar {
  max-width: 80%;
}

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
