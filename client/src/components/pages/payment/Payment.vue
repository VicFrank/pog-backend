<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Payment</h1>
      <div class="container text-center">
        <div class="real-money-store">
          <b-card header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <h6 class="mb-0">Payment</h6>
            </template>
            <b-card-text v-if="item.item_type === 'POGGERS'">
              Item:
              <img class="pogcoin" src="../cosmetics/images/pogcoin_gold.png" alt="Pog Coin" />
              {{ item.reward }} POGGERS
            </b-card-text>
            <b-card-text v-else-if="item.item_type === 'XP'">
              Item:
              {{ item.reward }} XP
            </b-card-text>
            <b-card-text>Price: ${{ item.cost_usd }}</b-card-text>

            <template v-slot:footer></template>
          </b-card>
          <template v-if="loggedIn">
            <div v-if="loading" class="d-flex justify-content-center mb-3">
              <b-spinner label="Loading..."></b-spinner>
            </div>
            <b-card v-else class="payment-options">
              <StripePurchase class="my-3" :item="item" />
              <PaypalPurchase :item="item" />
            </b-card>
          </template>
          <template v-else>
            <LoginButton></LoginButton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaypalPurchase from "./PaypalPurchase";
import StripePurchase from "./StripePurchase";
import LoginButton from "../login/LoginButton";

export default {
  components: {
    LoginButton,
    PaypalPurchase,
    StripePurchase
  },

  data() {
    return {
      item: {},
      error: "",
      showError: false,
      loading: true
    };
  },

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  },

  created() {
    fetch(`/api/cosmetics/item_prices/${this.$route.params.item_id}`)
      .then(res => res.json())
      .then(item => {
        if (item) {
          this.item = item;
          this.loading = false;
        } else {
          this.error = "Invalid Item";
          this.showError = true;
          this.$router.push("/store");
        }
      })
      .catch(err => {
        this.showError = true;
        this.error = err;
      });
  }
};
</script>

<style scoped>
.real-money-store {
  max-width: 300px;
  margin: auto;
}

.item-details {
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
