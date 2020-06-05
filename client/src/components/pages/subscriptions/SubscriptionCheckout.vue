<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Purchase Subscription</h1>
      <div class="container text-center">
        <template v-if="tier">
          <template v-if="loggedIn">
            <h2>Ticket {{tier}}</h2>
            <img :src="ticketImage" alt="Ticket" />

            <div class="purchase-options">
              <StripeSubscription :tier="tier" class="mb-3" />
              <PaypalSubscription :tier="tier" />
              <b-alert v-model="showError" variant="danger" dismissible>{{ error }}</b-alert>
            </div>
          </template>
          <template v-else>
            <LoginButton />
          </template>
        </template>
        <template v-else>No tier {{tier}}</template>
      </div>
    </div>
  </div>
</template>

<script>
import LoginButton from "../login/LoginButton";
import PaypalSubscription from "../payment/PaypalSubscription";
import StripeSubscription from "../payment/StripeSubscription";

export default {
  data() {
    return {
      error: "",
      showError: false,
      loading: true
    };
  },

  components: {
    LoginButton,
    PaypalSubscription,
    StripeSubscription
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
    ticketImage() {
      const tier = this.tier;
      return require(`./images/ticketicon_${tier}.png`);
    }
  }
};
</script>

<style scoped>
.purchase-options {
  max-width: 200px;
  margin: auto;
}
</style>