<template>
  <b-img-lazy v-bind:src="getHeroPath(hero)" v-bind:alt="hero | translateDota" />
</template>

<script>
export default {
  props: {
    hero: String
  },

  methods: {
    getHeroPath(hero) {
      if (hero && hero.startsWith("npc_dota_hero")) {
        hero = hero.slice(14);
      }
      return require(`../../../assets/images/heroes/${hero}.png`);
    }
  }
};
</script>

<style>
.image-container {
  position: relative;
  display: inline-block;
  margin-right: 2px;
  overflow: hidden;
}

.image-container img {
  width: 40px;
}
</style>
