<template>
  <div class="container">
    <h1 class="page-title" v-t="'custom_heroes.page_title'"></h1>
    <div class="heroes-list">
      <a
        v-for="hero in heroes"
        :key="hero"
        :href="`/custom_heroes/${hero}`"
        class="mx-3"
      >
        <img :src="getHeroPath(hero)" :alt="hero" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    heroes: ["thunderboar", "mifune"],
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
</style>