<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Battle Pass</h1>
      <ul class="battlepass-timeline">
        <li v-for="i in 100" :key="i">
          <div v-bind:class="{ 'direction-r': isEven(i), 'direction-l': !isEven(i) }">
            <span>Level {{i}}</span>
            <div v-bind:class="{ 'lvl-wrapper': true, 'lvl-locked': i >= bpLevel }">
              <img :src="getImgUrl(i)" alt />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    bpLevel() {
      return this.$store.state.auth.bpLevel;
    },
  },
  methods: {
    isEven(number) {
      return number % 2 === 0;
    },
    getImgUrl(number) {
      const level = (number % 5) + 1;
      return require(`./lvl${level}.svg`);
    }
  }
};
</script>

<style></style>
