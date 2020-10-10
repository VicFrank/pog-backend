<template>
  <b-table hover :fields="fields" :items="heroes" responsive>
    <template v-slot:cell(hero)="data">
      <div class="hero-col">
        <HeroImage class="hero-image" :hero="data.item.hero"></HeroImage>
        {{ $t(`dota.${data.item.hero}`) }}
      </div>
    </template>
    <template v-slot:cell(games)="data">
      {{ data.item.games }}
      <PercentBar
        :max="maxGames"
        :value="data.item.games"
        class="mt-1 progress-bar"
      ></PercentBar>
    </template>
    <template v-slot:cell(win_rate)="data">
      {{ data.item.win_rate | percentage(1) }}
      <PercentBar
        :max="1"
        :value="data.item.win_rate"
        class="mt-1 progress-bar"
      ></PercentBar>
    </template>
    <template v-slot:cell(kdr)="data">
      {{ data.item.avg_kills | round(1) }}/{{
        data.item.avg_deaths | round(1)
      }}/{{ data.item.avg_assists | round(1) }}
      <PercentBar
        :max="maxKDR"
        :value="data.item.kdr"
        class="mt-1 progress-bar"
      ></PercentBar>
    </template>
  </b-table>
</template>

<script>
import HeroImage from "./HeroImage.vue";
import PercentBar from "../../utility/PercentBar";

export default {
  components: {
    HeroImage,
    PercentBar,
  },

  props: {
    numItems: {
      type: Number,
      default: -1,
    },
    steamID: String,
  },

  data: () => ({
    fields: [],
    heroes: [],
    maxGames: 0,
    maxKDR: 0,
  }),

  created() {
    this.fields = [
      {
        key: "hero",
        sortable: true,
        thClass: "table-head text-left",
        label: this.$i18n.t("tables.hero"),
      },
      {
        key: "games",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.games"),
      },
      {
        key: "win_rate",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.winrate"),
      },
      {
        key: "kdr",
        sortable: true,
        thClass: "table-head text-left",
        tdClass: "text-left",
        label: this.$i18n.t("tables.kdr"),
      },
    ];
    this.getStats();
  },

  methods: {
    getStats() {
      fetch(`/api/players/${this.steamID}/heroes`)
        .then((res) => res.json())
        .then((heroes) => {
          this.heroes = heroes.map((stats) => ({
            hero: stats.hero,
            games: stats.games,
            win_rate: stats.wins / stats.games,
            kdr: stats.avg_kills / stats.avg_deaths,
            avg_kills: stats.avg_kills,
            avg_deaths: stats.avg_deaths,
            avg_assists: stats.avg_assists,
          }));
          this.maxGames = this.getMaxArray(this.heroes, "games");
          this.maxKDR = this.getMaxArray(this.heroes, "kdr");

          if (this.numItems > 0) {
            this.heroes = this.heroes.slice(0, this.numItems);
          }
        });
    },
    getMaxArray(arr, property) {
      return arr.reduce(
        (max, b) => Math.max(max, b[property]),
        arr[0][property]
      );
    },
  },
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