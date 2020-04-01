<template>
  <footer>
    <div class="footer">
      <img class="ml-5" src="../assets/images/logo.svg" alt="POG" />

      <div class="social">
        <a
          href="https://www.youtube.com/user/DotaCinema"
          target="_blank"
          class="fa fa-youtube mr-3"
        ></a>
        <a href="http://discord.gg/sunsfan" target="_blank" class="fab fa-discord mr-3"></a>
        <a href="https://www.reddit.com/r/DotaCinema/" class="fa fa-reddit mr-3"></a>
        <a href="https://twitter.com/DotaCinema" target="_blank" class="fa fa-twitter mr-3"></a>
        <a href="https://www.facebook.com/DotaCinema/" target="_blank" class="fa fa-facebook mr-5"></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
.footer {
  bottom: 0;

  width: 100%;
  height: 60px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: rgb(26, 35, 43);
}

.social {
  display: flex;

  font-size: 20px;
}
</style>