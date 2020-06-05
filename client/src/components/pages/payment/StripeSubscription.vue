<template>
  <div>
    <b-button variant="primary" @click="createCheckoutSession">
      {{ $t("payment.pay_with_stripe") }}
      <b-spinner v-if="loading" :label="$t('payment.loading')"></b-spinner>
    </b-button>
    <b-alert v-model="showError" variant="danger" dismissible>{{ error }}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    tier: Number
  },

  data: () => ({
    error: "",
    showError: false,
    loading: false
  }),

  computed: {
    // Dev
    priceID() {
      switch (this.tier) {
        case 1:
          return "price_HOGZXd1ZZTjTtr";
        case 2:
          return "price_HOGZQIwIIjnCnB";
        case 3:
          return "price_HOGZmU6paLJ9wK";
      }
      return null;
    }
    // Production
    // priceID() {
    //   switch (this.tier) {
    //     case 1:
    //       return "";
    //     case 2:
    //       return "";
    //     case 3:
    //       return "";
    //   }
    // },
  },

  async created() {
    const stripe = window.Stripe("pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2");
    this.stripe = stripe;
  },

  methods: {
    // Create a Checkout Session with the selected plan ID
    createCheckoutSession() {
      this.loading = true;
      fetch("/api/payments/stripe/create_checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priceID: this.priceID,
          steamID: this.$store.state.auth.userSteamID
        })
      })
        .then(res => res.json())
        .then(res => {
          // Call Stripe.js method to redirect to the new Checkout page
          this.stripe
            .redirectToCheckout({
              sessionId: res.sessionId
            })
            .then(res => {
              console.log(res);
              if (res.error) {
                this.showError = true;
                this.error = res.error.message;
              }
            })
            .catch(err => {
              console.log(err);
            });
        });
    }
  }
};
</script>

<style>
</style>