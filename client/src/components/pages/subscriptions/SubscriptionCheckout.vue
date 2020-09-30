<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Purchase Subscription</h1>
      <div class="container text-center">
        <template v-if="tier">
          <template v-if="loggedIn">
            <div class="checkout-form">
              <h2>{{ $t(`subscriptions.tier${tier}`) }}</h2>
              <div>
                <span class="cost">${{ price }}</span>
                <span class="duration text-muted">/Mo</span>
              </div>
              <div>
                <img :src="ticketImage" alt="Ticket" />
              </div>
              <b-form-select
                v-model="months"
                :options="options"
                class="purchase-options"
              ></b-form-select>
              <b-card v-if="months !== null" class="stripe-card mt-3">
                <div class="purchase-options">
                  <StripePurchase
                    :item="item"
                    v-on:purchaseSuccess="onPurchaseSuccess"
                    v-on:error="onError"
                  />
                  <!-- <PaypalSubscription :tier="tier" /> -->
                  <b-alert v-model="showError" variant="danger" dismissible>{{
                    error
                  }}</b-alert>
                </div>
              </b-card>
            </div>
          </template>
          <template v-else>
            <LoginButton />
          </template>
        </template>
        <template v-else>No tier {{ tier }}</template>
      </div>
    </div>
  </div>
</template>

<script>
import LoginButton from "../login/LoginButton";
// import PaypalSubscription from "../payment/PaypalSubscription";
// import StripeSubscription from "../payment/StripeSubscription";
import StripePurchase from "../payment/StripePurchase";

export default {
  data() {
    return {
      error: "",
      showError: false,
      loading: true,
      months: null,
      options: [
        { value: null, text: "Months" },
        { value: 1, text: "1 Month" },
        { value: 6, text: "6 Months" },
        { value: 12, text: "12 Months" },
      ],
    };
  },

  components: {
    LoginButton,
    // PaypalSubscription,
    // StripeSubscription,
    StripePurchase,
  },

  created() {
    if (!this.tier) {
      this.$router.push("/subscriptions");
    }
  },

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    tier() {
      const route = this.$route.params.tier;
      const tier = route.substring(4);
      if (tier == 1 || tier == 2 || tier == 3) {
        return Number(tier);
      }
      return null;
    },
    item() {
      return {
        item_id: `bp_${this.tier}_${this.months}`,
        cost_usd: this.price * this.months,
      };
    },
    price() {
      switch (this.tier) {
        case 1:
          return 2;
        case 2:
          return 5;
        case 3:
          return 15;
        default:
          return 0;
      }
    },
    ticketImage() {
      const tier = this.tier;
      return require(`./images/ticketicon_${tier}.png`);
    },
  },

  methods: {
    onPurchaseSuccess() {
      this.$router.push("/payment_success");
    },
    onError(error) {
      this.error = error;
      this.showError = true;
    },
  },
};
</script>

<style scoped>
.purchase-options {
  max-width: 200px;
  margin: auto;
}

.cost {
  font-size: 24px;
}

.checkout-form {
  max-width: 600px;
  margin: auto;
}

.stripe-card {
  max-width: 280px;
  margin: auto;
}
</style>