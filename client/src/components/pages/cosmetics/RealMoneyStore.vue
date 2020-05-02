<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Payment</h1>
      <div class="container text-center">
        <div class="real-money-store">
          <h3>Select a product</h3>
          <b-tabs content-class="my-3">
            <b-tab title="POGGERS" active>
              <h3>POGGERS</h3>
              <b-button-group vertical class="mb-3">
                <b-button
                  block
                  v-for="product in poggersProducts"
                  :key="product.poggers"
                  v-on:click="selectedProduct = product"
                >
                  <img
                    class="pogcoin"
                    src="./images/pogcoin_gold.png"
                    alt="Pog Coin"
                  />
                  {{ product.reward }} POGGERS - ${{ product.cost_usd }}
                </b-button>
              </b-button-group>
            </b-tab>
            <b-tab title="XP">
              <h3>Battle Pass XP</h3>
              <b-button-group vertical class="mb-3">
                <b-button
                  block
                  v-for="product in xpProducts"
                  :key="product.poggers"
                  v-on:click="selectedProduct = product"
                  >{{ product.reward }} XP - ${{ product.cost_usd }}</b-button
                >
              </b-button-group>
            </b-tab>
          </b-tabs>
          <template v-if="selectedProduct.cost_usd">
            <template v-if="loggedIn">
              <b-card header-tag="header" footer-tag="footer" class="mb-3">
                <template v-slot:header>
                  <h6 class="mb-0">Payment</h6>
                </template>
                <b-card-text v-if="selectedProduct.item_type === 'POGGERS'">
                  Item:
                  <img
                    class="pogcoin"
                    src="../cosmetics/images/pogcoin_gold.png"
                    alt="Pog Coin"
                  />
                  {{ selectedProduct.reward }} POGGERS
                </b-card-text>
                <b-card-text v-else-if="selectedProduct.item_type === 'XP'">
                  Item:
                  {{ selectedProduct.reward }} XP
                </b-card-text>
                <b-card-text
                  >Price: ${{ selectedProduct.cost_usd }}</b-card-text
                >

                <template v-slot:footer></template>
              </b-card>
              <b-button
                class="mb-3"
                :to="`/checkout/${selectedProduct.item_id}`"
                variant="primary"
                >Proceed to checkout</b-button
              >
            </template>
            <template v-else>
              <p>Login to complete your purchase</p>
              <LoginButton></LoginButton>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginButton from "../login/LoginButton";

export default {
  components: {
    LoginButton,
  },
  data() {
    return {
      selectedProduct: {},
      poggersProducts: [],
      xpProducts: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  created() {
    fetch(`/api/cosmetics/item_prices`)
      .then((res) => res.json())
      .then((products) => {
        this.poggersProducts = products
          .filter((item) => item.item_type === "POGGERS")
          .sort((a, b) => a.cost_usd - b.cost_usd);
        this.xpProducts = products
          .filter((item) => item.item_type === "XP")
          .sort((a, b) => a.cost_usd - b.cost_usd);
      })
      .catch((err) => {
        this.showError = true;
        this.error = err;
      });
  },
};
</script>

<style scoped>
.real-money-store {
  max-width: 300px;
  margin: auto;
}

.tabs {
  background-color: rgba(255, 255, 255, 0.1);
}

.card-body {
  color: black;
}

.nav-link {
  color: #495057 !important;
}
</style>
