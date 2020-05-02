<template>
  <div>
    <div ref="card"></div>
    <b-button
      variant="primary"
      @click="submitPayment"
      :disabled="!paymentIntent || !complete"
      >Pay with Stripe</b-button
    >
  </div>
</template>

<script>
let card = undefined;
export default {
  props: {
    item: {},
  },

  data: () => ({
    error: "",
    showError: false,
    complete: false,
    paymentIntent: false,
    clientSecret: "",
  }),

  async created() {
    const stripe = window.Stripe("pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2");
    this.stripe = stripe;
    const elements = stripe.elements();
    this.paymentIntent = await this.createIntent();
    this.clientSecret = this.paymentIntent.client_secret;
    this.createCardForm(elements);
  },

  methods: {
    async createIntent() {
      const url = "/api/payments/stripe/intents";
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: this.item.cost_usd * 100, // stripe amounts are in cents
          name: this.item.item_id,
        }),
      };
      const intent = await fetch(url, params);

      if (!intent.ok) {
        const error = await intent.json();
        this.$emit("error", error.message);
        return;
      }

      return intent.json();
    },

    createCardForm(elements) {
      card = elements.create("card");
      card.mount(this.$refs.card);

      card.on("change", (e) => (this.complete = e.complete));
    },

    async submitPayment() {
      const result = await this.stripe.handleCardPayment(
        this.clientSecret,
        card,
        {
          payment_method_data: {},
        }
      );

      if (result.error) {
        console.error(result.error);
        this.$emit("error", result.error);
      } else {
        this.$emit("purchaseSuccess");
      }
    },
  },
};
</script>

<style></style>
