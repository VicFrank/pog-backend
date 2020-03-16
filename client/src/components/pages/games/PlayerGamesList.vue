<template>
  <div class="row">
    <div class="col-xl-12">
      <div class="match-history">
        <table class="table">
          <tbody>
            <tr>
              <td class="tb-head" scope="col">Hero</td>
              <td class="tb-head" scope="col">Result</td>
              <td class="tb-head" scope="col">Duration</td>
              <td class="tb-head" scope="col">KDA</td>
              <td class="tb-head" scope="col">Items</td>
            </tr>
            <router-link
              v-for="game in games"
              :key="game.game_id"
              :to="'/demo/games/' + game.game_id"
              tag="tr"
            >
              <th scope="row">
                <HeroImage :hero="game.hero"></HeroImage>
                {{ game.hero | translateDota }}
              </th>
              <td>
                <span v-if="game.won" class="win">Won</span>
                <span v-else class="loss">Lost</span>
              </td>
              <td>{{ game.duration | hhmmss }}</td>
              <td>{{ game.kills }}/{{ game.deaths }}/{{ game.assists }}</td>
              <td>
                <ItemImage :itemName="game.item_0"></ItemImage>
                <ItemImage :itemName="game.item_1"></ItemImage>
                <ItemImage :itemName="game.item_2"></ItemImage>
                <ItemImage :itemName="game.item_3"></ItemImage>
                <ItemImage :itemName="game.item_4"></ItemImage>
                <ItemImage :itemName="game.item_5"></ItemImage>
              </td>
            </router-link>
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
    gamesToShow: []
  }),

  components: {
    ItemImage,
    HeroImage
  },

  props: {
    games: Array
  }
};
</script>

<style scoped>
tr {
  cursor: pointer;
}

tr:hover {
  background-color: #324250;
}
</style>
