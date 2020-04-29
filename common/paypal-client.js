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
  if (process.env.IS_PRODUCTION) {
    const clientId = keys.paypal.production.clientID;
    const clientSecret = keys.paypal.production.secret;

    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  } else {
    const clientId = keys.paypal.dev.clientID;
    const clientSecret = keys.paypal.dev.secret;

    return new checkoutNodeJssdk.core.SandboxEnvironment(
      clientId,
      clientSecret
    );
  }
}

module.exports = { client: client };
