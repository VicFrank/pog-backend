<template>
  <header id="main-nav">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <SidebarToggle class="navbar-nav mr-1"></SidebarToggle>
        <router-link to="/" class="navbar-brand">
          <img src="../assets/images/logo_beta.png" alt="POG" />
        </router-link>
      </div>
      <ul class="navbar-nav mx-auto flex-row d-none d-lg-flex">
        <b-nav-item-dropdown text="LEARN" class="mr-5">
          <b-dropdown-item to="/faq">FAQ</b-dropdown-item>
          <b-dropdown-item to="/guardians">GUARDIANS</b-dropdown-item>
          <b-dropdown-item to="/media">VIDEOS</b-dropdown-item>
          <b-dropdown-item to="/chest_rates">CHEST DROPS</b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item mr-5">
          <router-link class="nav-link" to="/store">STORE</router-link>
        </li>
        <b-nav-item-dropdown text="STATS" class="mr-5">
          <b-dropdown-item to="/games">GAMES</b-dropdown-item>
          <b-dropdown-item to="/heroes">HEROES</b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item">
          <router-link class="nav-link" to="/changelog">CHANGE LOG</router-link>
        </li>
      </ul>
      <div class="d-flex align-items-center">
        <!-- <div class="d-none d-md-flex">
          <a
            href="https://www.youtube.com/user/DotaCinema"
            target="_blank"
            class="fa fa-youtube mr-3"
          ></a>
          <a href="https://www.twitch.tv/sunsfantv" target="_blank" class="fa fa-twitch mr-3"></a>
          <a href="http://discord.gg/sunsfan" target="_blank" class="fab fa-discord mr-3"></a>
          <a href="https://www.reddit.com/r/DotaCinema/" target="_blank" class="fa fa-reddit mr-3"></a>
          <a href="https://twitter.com/DotaCinema" target="_blank" class="fa fa-twitter mr-3"></a>
          <a
            href="https://www.facebook.com/DotaCinema/"
            target="_blank"
            class="fa fa-facebook mr-3"
          ></a>
        </div>-->

        <div>
          <b-button
            class="d-none d-md-flex mr-3"
            href="https://www.reddit.com/r/DotaCinema/comments/gaw4ah/pog_bug_report_megathread/"
            target="_blank"
            variant="secondary"
            >Report A Bug</b-button
          >
        </div>
        <div>
          <b-button
            class="d-flex"
            href="https://steamcommunity.com/sharedfiles/filedetails/?id=2077900442"
            target="_blank"
            variant="primary"
            >PLAY NOW</b-button
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import SidebarToggle from "./SidebarToggle.vue";
export default {
  components: {
    SidebarToggle,
  },
};
</script>

<style></style>
