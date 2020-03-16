<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Payment</h1>
      <div class="container">
        <b-list-group class="product-list mb-3">
          <b-list-group-item
            button
            v-for="product in products"
            :key="product.poggers"
            v-on:click="selectedProduct = product"
          >
            {{ product.poggers }} POGGERS - ${{
            product.price_usd
            }}
          </b-list-group-item>
        </b-list-group>
        <p v-if="selectedProduct">{{selectedProduct}}</p>
        <template v-if="loggedIn">
          <div class="payment-options">
            <div ref="paypal"></div>
          </div>
        </template>
        <template v-else>
          <p>Login to complete your purchase</p>
          <LoginButton></LoginButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import LoginButton from "../login/LoginButton";

export default {
  components: {
    LoginButton
  },
  data() {
    return {
      credentials: {
        sandbox:
          "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        production: "<production client id>"
      },
      selectedProduct: {},
      products: [
        {
          price_usd: 1,
          poggers: 100
        },
        {
          price_usd: 5,
          poggers: 550
        },
        {
          price_usd: 10,
          poggers: 1150
        },
        {
          price_usd: 20,
          poggers: 2400
        },
        {
          price_usd: 50,
          poggers: 6500
        },
        {
          price_usd: 100,
          poggers: 15000
        }
      ]
    };
  },
  mounted() {
    const script = document.createElement("script");
    const clientID = this.credentials.sandbox;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded() {
      const steamID = this.$store.state.auth.userSteamID;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: 10
                  }
                }
              ]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function() {
              return fetch(`/api/payments/paypal/${steamID}`, {
                method: "post",
                headers: {
                  "content-type": "application/json"
                },
                body: JSON.stringify({
                  orderID: data.orderID
                })
              });
            });
          },
          onError: err => {
            console.log(err);
          }
        })
        .render(this.$refs.paypal);
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>

<style scoped>
.product-list {
  width: 400px;
}

.payment-options {
  position: relative;
  z-index: 1;
  width: 200px;
  margin: auto;
}
</style>
