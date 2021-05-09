<template>
  <div class="container">
    <h1 class="page-title" v-t="'custom_heroes.page_title'"></h1>
    <div class="heroes-list">
      <a
        v-for="hero in heroes"
        :key="hero"
        :href="`/custom_heroes/${hero}`"
        class="mx-3 my-3"
      >
        <img :src="getHeroPath(hero)" :alt="hero" class="hero-image" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    heroes: [
      "thunderboar",
      "mifune",
      "pc",
      "alexandria",
      "warp_beast",
      "troy",
      "lathaal",
      "scaldris",
    ],
  }),

  methods: {
    getHeroPath(hero) {
      return require(`../../../assets/images/heroes/${hero}.png`);
    },
  },
};
</script>

<style scoped>
.heroes-list {
  margin: auto;
  width: 600px;

  text-align: center;
}

.hero-image {
  height: 76px;
  width: 128px;
}
</style>