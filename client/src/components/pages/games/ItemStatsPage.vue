<template></template>

<script>
import ItemImage from "./ItemImage.vue";

export default {
  data: () => ({
    items: []
  }),

  components: {
    HeroImage
  },

  created() {
    fetch(`/api/games/stats/items`)
      .then(res => res.json())
      .then(items => {
        this.items = items;
      });
  }
};
</script>

<style>
</style>