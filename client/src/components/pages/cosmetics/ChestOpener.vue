<template>
  <div>
    <img
      v-if="!opened"
      class="chest-image"
      v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
      :alt="cosmetic.cosmetic_id"
    />
    <img
      v-else
      class="chest-image"
      v-bind:src="openedImage(cosmetic.cosmetic_id)"
      :alt="cosmetic.cosmetic_id"
    />
    <div v-if="items.length > 0" class="mt-2">
      <div class="h2 text-center blue">Items</div>
      <div>
        <div
          v-for="item of items"
          :key="item.cosmetic_id"
          class="text-center"
        >{{cosmeticName(item.cosmetic_id)}} - {{item.rarity}}</div>
      </div>
    </div>

    <div v-if="poggers > 0" class="text-center mt-1">
      <img class="pogcoin" src="./images/pogcoin_gold.png" alt="Pog Coin" />
      {{poggers}} POGGERS
    </div>
    <b-alert v-model="showError" variant="danger" dismissible>{{error}}</b-alert>
    <div class="mt-4 d-flex justify-content-end">
      <b-button v-if="!opened" class="mr-2" variant="secondary" @click="cancel">Close</b-button>
      <b-button v-if="!opened" class="mr-2" variant="primary" @click="open">Open</b-button>
      <b-button v-else class="mr-2" variant="primary" @click="claim">Claim Items</b-button>
    </div>
  </div>
</template>

<script>
import cosmeticsData from "./cosmeticNames";

export default {
  data: () => ({
    error: "",
    showError: false,
    items: [],
    poggers: 0,
    opened: false
  }),
  props: {
    cosmetic: {},
    test: -1
  },
  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    claim() {
      this.$emit("claim");
    },
    open() {
      const cosmeticID = this.cosmetic.cosmetic_id;

      if (this.cosmetic.cosmetic_type !== "Chest") {
        this.error = "Tried to open an item that wasn't a chest";
        this.showError = true;
        return;
      }

      fetch(`/api/players/${this.steamID}/open_chest/${cosmeticID}`, {
        method: "post"
      })
        .then(res => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then(res => res.json())
        .then(res => {
          this.items = res.items;
          this.poggers = res.poggers;
          this.opened = true;
          this.$emit("open");
        })
        .catch(err => {
          this.error = err;
          this.showError = true;
        });
    },
    cosmeticImageSrc(cosmeticID) {
      return require(`./images/${cosmeticID}.png`);
    },
    openedImage(cosmeticID) {
      return require(`./images/${cosmeticID}_open.png`);
    },
    cosmeticName(cosmeticID) {
      return cosmeticsData[cosmeticID];
    }
  }
};
</script>

<style scoped>
.chest-image {
  width: 200px;
  height: 200px;
  display: block;
  margin: auto;
  transition: all 0.2s ease-in-out;
}

.chest-image:hover {
  transform: scale(1.1);
}
</style>
