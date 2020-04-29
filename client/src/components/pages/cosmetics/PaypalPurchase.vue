<template>
  <b-card header-tag="header" footer-tag="footer" class="payment-card">
    <template v-slot:header>
      <h6 class="mb-0">Payment</h6>
    </template>
    <b-card-text v-if="item.item_type === 'POGGERS'">
      Item:
      <img class="pogcoin" src="./images/pogcoin_gold.png" alt="Pog Coin" />
      {{item.reward}} POGGERS
    </b-card-text>
    <b-card-text v-else-if="item.item_type === 'XP'">
      Item:
      {{item.reward}} XP
    </b-card-text>
    <b-card-text>Price: ${{item.cost_usd}}</b-card-text>
    <b-alert v-model="showError" variant="danger" dismissible>{{error}}</b-alert>
    <b-alert v-model="showSuccess" variant="success" dismissible>{{success}}</b-alert>
    <template v-slot:footer>
      <div class="paypal-container" ref="paypal"></div>
    </template>
  </b-card>
</template>

<script>
export default {
  props: {
    item: {}
  },

  data() {
    return {
      credentials: {
        sandbox:
          "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        production:
          "ARyCiFJGaPqBv5V0OJNPloAOgwUDp-YOu2cLtrp8fdTLlpBCaIfbXhnFHfVuMylXG9iyPaKCw2SR2D4V"
      },
      error: "",
      showError: false,
      success: "",
      showSuccess: false
    };
  },

  mounted() {
    const script = document.createElement("script");
    const clientID = this.credentials.production;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },

  methods: {
    setLoaded() {
      const steamID = this.$store.state.auth.userSteamID;
      const itemID = this.item.item_id;
      const cost_usd = this.item.cost_usd;
      const _this = this;
      window.paypal
        .Buttons({
          style: {
            size: "small",
            color: "gold",
            shape: "pill",
            label: "checkout",
            layout: "horizontal"
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: cost_usd
                  }
                }
              ],
              application_context: { shipping_preference: "NO_SHIPPING" }
            });
          },
          onApprove: function(data) {
            return fetch(`/api/payments/paypal/${steamID}`, {
              method: "post",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                orderID: data.orderID,
                itemID
              })
            })
              .then(res => res.json())
              .then(res => {
                if (res.message === "Payment Success") {
                  _this.$store.dispatch("refreshPlayer");
                  _this.success = res.message;
                  _this.showSuccess = true;
                  _this.$bvToast.toast(
                    `Added ${_this.item.reward} ${_this.item.item_type} to your armory`,
                    {
                      title: `Notification`,
                      toaster: "b-toaster-bottom-left",
                      solid: true,
                      appendToast: true
                    }
                  );
                } else {
                  _this.error = res.message;
                  _this.showError = true;
                }
              })
              .catch(err => {
                _this.error = err;
                _this.showError = true;
              });
          },
          onError: err => {
            _this.showError = true;
            _this.error = err;
          }
        })
        .render(this.$refs.paypal);
    }
  }
};
</script>

<style scoped>
.purchase-preview {
  width: 200px;
  height: 200px;
}

.paypal-container {
  max-width: 200px;
  margin: auto;
}

.payment-card {
  max-width: 400px;
  margin: auto;
}

.card {
  color: black !important;
}

.card-footer {
  height: 100% !important;
}
</style>