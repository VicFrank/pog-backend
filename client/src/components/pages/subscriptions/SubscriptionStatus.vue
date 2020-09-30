<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title" v-t="'subscriptions.manage_page_title'"></h1>
      <div class="container text-center">
        <b-card-group deck class="mb-3">
          <b-card v-for="i in 3" :key="i">
            <template v-slot:header>
              <div class="ticket-name" v-t="`subscriptions.tier${i}`"></div>
              <img
                :src="ticketImage(i)"
                alt="Silver Ticket"
                v-bind:class="{ faded: !hasTier(i) }"
              />
              <div v-if="bpTier === i" v-t="'subscriptions.current_tier'"></div>
            </template>
            <b-card-text v-if="hasTier(i)"
              >Expires {{ getExpiration(i) | dateFromNow }}</b-card-text
            >
          </b-card>
        </b-card-group>
        <template v-if="bpTier === 0"
          ><h3>You don't have a subscription!</h3>
          <b-button variant="primary" to="/subscriptions">Get one now</b-button>
        </template>
        <template v-else-if="bpTier < 3">
          <b-button variant="primary" to="/subscriptions"
            >Upgrade your subscription</b-button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    subscriptions: {},
  }),

  created() {
    fetch(`/api/players/${this.steamID}/battle_pass/subscriptions`)
      .then((res) => res.json())
      .then((subscriptions) => {
        this.subscriptions = subscriptions;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    bpTier() {
      return this.$store.getters.bpTier;
    },
  },

  methods: {
    ticketImage(tier) {
      return require(`./images/ticketicon_${tier}.png`);
    },
    hasTier(tier) {
      return this.subscriptions[`has_tier${tier}`];
    },
    getExpiration(tier) {
      return this.subscriptions[`tier${tier}_expiration`];
    },
  },
};
</script>

<style scoped>
.faded {
  filter: grayscale(100%);
}
.card-header {
  color: black;
}
.card-header img {
  max-width: 100%;
}
.card-body {
  color: black;
}
</style>