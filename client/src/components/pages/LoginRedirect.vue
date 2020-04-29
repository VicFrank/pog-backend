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
          const { displayName, photos, id, isAdmin, poggers } = res.user;

          this.$store.commit({
            type: "setUser",
            username: displayName,
            steamID: id,
            picture: photos[2].value,
            isAdmin,
            poggers
          });

          this.$router.push("/profile");
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
