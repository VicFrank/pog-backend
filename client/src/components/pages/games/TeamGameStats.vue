<template>
  <table class="table">
    <tbody>
      <tr>
        <td class="tb-head">Player</td>
        <td class="tb-head">KDA</td>
        <td class="tb-head">LH/DN</td>
        <td class="tb-head">Gold</td>
        <td class="tb-head">DMG</td>
        <td class="tb-head">Items</td>
      </tr>
      <tr v-for="player in players" :key="player.steam_id">
        <th scope="row">
          <HeroImage :hero="player.hero"></HeroImage>
          <RouterLink :to="`/players/${player.steam_id}`">{{ player.username }}</RouterLink>
        </th>
        <td>{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</td>
        <td>{{ player.last_hits }}/{{ player.denies }}</td>
        <td class="gold-color">{{ player.total_gold }}</td>
        <td>{{ player.hero_damage }}</td>
        <td>
          <ItemImage :itemName="player.item_0"></ItemImage>
          <ItemImage :itemName="player.item_1"></ItemImage>
          <ItemImage :itemName="player.item_2"></ItemImage>
          <ItemImage :itemName="player.item_3"></ItemImage>
          <ItemImage :itemName="player.item_4"></ItemImage>
          <ItemImage :itemName="player.item_5"></ItemImage>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ItemImage from "./ItemImage.vue";
import HeroImage from "./HeroImage.vue";

export default {
  components: {
    ItemImage,
    HeroImage
  },

  props: {
    players: Array
  }
};
</script>

<style></style>
