<template>
  <div class="row">
    <div class="col-xl-12">
      <div class="match-history">
        <table class="table">
          <tbody>
            <tr>
              <td class="tb-head" scope="col">Hero</td>
              <td class="tb-head" scope="col">Result</td>
              <td v-if="showMMR" class="tb-head" scope="col">MMR</td>
              <td class="tb-head" scope="col">Duration</td>
              <td class="tb-head" scope="col">KDA</td>
              <td class="tb-head" scope="col">Items</td>
            </tr>
            <template v-if="loading">
              <tr v-for="i in 3" :key="i">
                <th scope="row" />
                <td />
                <td />
                <td />
                <td v-if="showMMR" />
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
                <th scope="row">
                  <HeroImage :hero="game.hero"></HeroImage>
                  {{ $t(`dota.${game.hero}`) }}
                </th>
                <td>
                  <span v-if="game.won" class="win" v-t="'tables.won'"></span>
                  <span v-else class="loss" v-t="'tables.lost'"></span>
                  <div v-if="game.xp_earned > 0" class="text-muted">
                    +{{ game.xp_earned }} XP
                  </div>
                  <div
                    v-else
                    v-b-tooltip.hover.html
                    :title="$t('tables.daily_limit')"
                    class="text-muted"
                  >
                    +0 XP
                    <i class="fas fa-info-circle info-icon"></i>
                  </div>
                </td>
                <td v-if="showMMR">
                  <div v-if="game.mmr_change >= 0" class="win">
                    +{{ game.mmr_change }}
                  </div>
                  <div v-else class="loss">{{ game.mmr_change }}</div>
                </td>
                <td>
                  <div>{{ game.duration | hhmmss }}</div>
                  <div class="text-muted">
                    {{ game.created_at | dateFromNow }}
                  </div>
                </td>
                <td>{{ game.kills }}/{{ game.deaths }}/{{ game.assists }}</td>
                <td>
                  <ItemImage
                    v-if="game.item_0"
                    :itemName="game.item_0"
                  ></ItemImage>
                  <ItemImage
                    v-if="game.item_1"
                    :itemName="game.item_1"
                  ></ItemImage>
                  <ItemImage
                    v-if="game.item_2"
                    :itemName="game.item_2"
                  ></ItemImage>
                  <ItemImage
                    v-if="game.item_3"
                    :itemName="game.item_3"
                  ></ItemImage>
                  <ItemImage
                    v-if="game.item_4"
                    :itemName="game.item_4"
                  ></ItemImage>
                  <ItemImage
                    v-if="game.item_5"
                    :itemName="game.item_5"
                  ></ItemImage>
                </td>
              </router-link>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ItemImage from "./ItemImage.vue";
import HeroImage from "./HeroImage.vue";

export default {
  data: () => ({
    page: 1,
    itemsPerPage: 15,
    gamesToShow: [],
  }),

  components: {
    ItemImage,
    HeroImage,
  },

  props: {
    games: Array,
    loading: Boolean,
    showMMR: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
tr {
  cursor: pointer;
  height: 65px;
}

tr:hover {
  background-color: #324250;
}
</style>
