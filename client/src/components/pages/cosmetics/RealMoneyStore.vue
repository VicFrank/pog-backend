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
                >
                  {{ product.reward }} XP - ${{ product.cost_usd }}
                </b-button>
              </b-button-group>
            </b-tab>
          </b-tabs>
          <template v-if="selectedProduct.cost_usd">
            <template v-if="loggedIn">
              <PaypalPurchase
                :item="selectedProduct"
                :credentials="cheapPaypalCredentials"
                paypalType="cheap"
              />
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
import PaypalPurchase from "../payment/PaypalPurchase";

export default {
  components: {
    LoginButton,
    PaypalPurchase,
  },
  data() {
    return {
      selectedProduct: {},
      poggersProducts: [],
      xpProducts: [],
      expensivePaypalCredentials: {
        sandbox:
          "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        production:
          "ARyCiFJGaPqBv5V0OJNPloAOgwUDp-YOu2cLtrp8fdTLlpBCaIfbXhnFHfVuMylXG9iyPaKCw2SR2D4V",
      },
      cheapPaypalCredentials: {
        sandbox:
          "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        production:
          "ARyCiFJGaPqBv5V0OJNPloAOgwUDp-YOu2cLtrp8fdTLlpBCaIfbXhnFHfVuMylXG9iyPaKCw2SR2D4V",
      },
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
