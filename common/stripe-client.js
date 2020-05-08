const Stripe = require("stripe");
const keys = require("../config/keys");

let secret;

if (process.env.IS_PRODUCTION) {
  secret = keys.stripe.production.secret;
} else {
  secret = keys.stripe.dev.secret;
}

const client = new Stripe(secret);
module.exports = { client };
