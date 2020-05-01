<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      {{
      error
      }}
    </b-alert>
    <b-alert v-model="showSuccess" variant="success" dismissible>
      {{
      success
      }}
    </b-alert>
    <div class="paypal-container" ref="paypal"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {},
    credentials: {},
    paypalType: String
  },

  data() {
    return {
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
      // "this" doesn't work in window.paypal because javascript sucks
      const steamID = this.$store.state.auth.userSteamID;
      const itemID = this.item.item_id;
      const cost_usd = this.item.cost_usd;
      const paypalType = this.paypalType;
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
                itemID,
                paypalType
              })
            })
              .then(res => res.json())
              .then(res => {
                if (res.message === "Payment Success") {
                  _this.$store.dispatch("refreshPlayer");
                  _this.success = res.message;
                  _this.showSuccess = true;
                  _this.$bvToast.toast(
                    `Added ${_this.item.reward} ${_this.item.item_type} to your account`,
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
