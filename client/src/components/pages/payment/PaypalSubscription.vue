<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>{{ error }}</b-alert>
    <b-alert v-model="showSuccess" variant="success" dismissible>{{ success }}</b-alert>
    <div v-if="processinPayment">
      {{$t('payment.processing')}}
      <div v-if="loading" class="d-flex justify-content-center mb-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
    <div v-else class="paypal-container" ref="paypal"></div>
  </div>
</template>

<script>
export default {
  props: {
    tier: Number
  },

  data() {
    return {
      error: "",
      showError: false,
      success: "",
      showSuccess: false,
      processinPayment: false,
      credentials: {
        sandbox:
          "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        production:
          "ARyCiFJGaPqBv5V0OJNPloAOgwUDp-YOu2cLtrp8fdTLlpBCaIfbXhnFHfVuMylXG9iyPaKCw2SR2D4V"
      },
      subscriptionTiers: [
        {
          tier: 1,
          dev_id: "P-8UE822565A794661HL3JVIZA",
          prod_id: ""
        },
        {
          tier: 2,
          dev_id: "P-78R14789P03088544L3JVJHQ",
          prod_id: ""
        },
        {
          tier: 3,
          dev_id: "P-7JN82105BY611805HL3JVJRI",
          prod_id: ""
        }
      ]
    };
  },

  mounted() {
    const script = document.createElement("script");
    const clientID = this.credentials.sandbox;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&vault=true`;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },

  methods: {
    setLoaded() {
      const planID = this.subscriptionTiers.find(
        tier => tier.tier === this.tier
      );
      console.log(planID);
      window.paypal
        .Buttons({
          style: {
            size: "small",
            color: "gold",
            shape: "pill",
            label: "checkout",
            layout: "vertical"
          },
          createSubscription: (data, actions) => {
            return actions.subscription.create({
              plan_id: planID
            });
          },

          onApprove: (data, actions) => {
            console.log(data, actions);
            console.log(
              "You have successfully created subscription " +
                data.subscriptionID
            );
          }
        })
        .render(this.$refs.paypal);
    }
  }
};
</script>

<style>
</style>