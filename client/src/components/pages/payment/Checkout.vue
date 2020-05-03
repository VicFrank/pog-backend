<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Checkout</h1>
      <div class="container text-center">
        <b-button to="/poggers" class="mb-3">Back to Store</b-button>
        <div class="real-money-store">
          <b-card header-tag="header" footer-tag="footer">
            <template v-slot:header>
              <h6 class="mb-0">Payment</h6>
            </template>
            <b-card-text v-if="item.item_type === 'POGGERS'">
              Item:
              <img class="pogcoin" src="../cosmetics/images/pogcoin_gold.png" alt="Pog Coin" />
              {{ item.reward | localizeNumber }} POGGERS
            </b-card-text>
            <b-card-text v-else-if="item.item_type === 'XP'">
              Item:
              {{ item.reward | localizeNumber }} XP
            </b-card-text>
            <b-card-text>Price: ${{ item.cost_usd }}</b-card-text>

            <template v-slot:footer></template>
          </b-card>
          <template v-if="loggedIn">
            <div v-if="loading" class="d-flex justify-content-center mb-3">
              <b-spinner label="Loading..."></b-spinner>
            </div>
            <b-card v-else class="payment-options mt-3">
              <!-- <StripePurchase
                class="my-3"
                :item="item"
                v-on:purchaseSuccess="onPurchaseSuccess"
                v-on:error="onError"
              />-->
              <PaypalPurchase
                :item="item"
                :paypalType="paypalType"
                v-on:purchaseSuccess="onPurchaseSuccess"
              />
              <b-alert v-model="showError" variant="danger" dismissible>{{ error }}</b-alert>
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
// import StripePurchase from "./StripePurchase";
import LoginButton from "../login/LoginButton";

export default {
  components: {
    LoginButton,
    PaypalPurchase
    // StripePurchase
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
    },
    paypalType() {
      return this.item.cost_usd < 12 ? "cheap" : "expensive";
    }
  },

  methods: {
    onPurchaseSuccess() {
      this.$router.push("/payment_success");
    },
    onError(error) {
      this.error = error;
      this.showError = true;
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
