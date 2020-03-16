const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const keys = require("../config/keys");

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
  let clientId = keys.paypal.dev.clientID;
  let clientSecret = keys.paypal.dev.secret;

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

module.exports = { client: client };
