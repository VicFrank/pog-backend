<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">You have subscribed</h1>
      <div class="container text-center">
        <!-- <pre>{{session}}</pre> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    showError: false,
    session: ""
  }),

  created() {
    // const sessionID = this.$route.query.session_id;
    // if (sessionID) {
    //   fetch("/api/payments/stripe/checkout_session?sessionID=" + sessionID)
    //     .then(res => res.json())
    //     .then(session => {
    //       const sessionJSON = JSON.stringify(session, null, 2);
    //       this.session = sessionJSON;
    //     })
    //     .catch(err => {
    //       console.log("Error when fetching Checkout session", err);
    //       this.error = err;
    //       this.showError = true;
    //       this.session = err;
    //     });
    // }
  }
};
</script>

<style scoped>
pre {
  color: white;
}
</style>