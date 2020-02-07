<template>
  <div class="match-item">
    <div class="image-container">
      <img
        v-bind:src="getItemPath(itemName)"
        v-bind:alt="itemName | translateDota"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemName: String,
  },

  methods: {
    getItemPath(itemName) {
      if (itemName && itemName.startsWith("item_")) {
        itemName = itemName.slice(5);
      }
      return require(`../../../assets/images/items/${itemName}.png`);
    },
  },
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
