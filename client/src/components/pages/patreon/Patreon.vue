<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Patreon Rewards</h1>
      <div class="container text-center">
        <template v-if="loggedIn">
          <p class="mb-3">Sign in to your Patreon account to claim your rewards.</p>
          <b-button class="patreon-color" href="/api/auth/patreon">Sign in to Patreon</b-button>
        </template>
        <template v-else>
          <LoginButton />
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

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>

<style>
.patreon-color {
  background-color: #f96854;
}
</style>