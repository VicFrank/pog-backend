<template>
  <div></div>
</template>

<script>
export default {
  created() {
    // get the current user and redirect to their profile
    // it's necessary to get this first so that the user is recognized
    // as logged in
    fetch("/api/auth/steam/success", { credentials: "include" })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const { photos, id, isAdmin } = res.user;

          this.$store.commit({
            type: "setUser",
            steamID: id,
            picture: photos[2].value,
            isAdmin
          });

          const returnTo = this.$route.query.return;

          if (returnTo) {
            this.$router.push(returnTo);
          } else {
            this.$router.push("/profile");
          }
        } else {
          this.$store.commit({
            type: "setNotLoggedIn"
          });
          this.$router.push("");
        }
      });
  }
};
</script>
