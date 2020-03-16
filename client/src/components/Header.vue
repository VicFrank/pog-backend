<template>
  <header id="main-nav">
    <nav class="navbar navbar-expand-lg">
      <SidebarToggle class="navbar-nav ml-1 mr-4"></SidebarToggle>
      <router-link to="/" class="navbar-brand">
        <img src="../assets/images/logo.svg" alt="POG" />
      </router-link>
      <ul class="navbar-nav mx-auto flex-row d-none d-lg-flex">
        <li class="nav-item mr-5">
          <router-link class="nav-link" to="/demo/learn">LEARN</router-link>
        </li>
        <!-- <li class="nav-item mr-5">
            <router-link class="nav-link" to="/demo/store">STORE</router-link>
        </li>-->
        <b-nav-item-dropdown text="STATS" class="mr-5">
          <b-dropdown-item to="/demo/games">GAMES</b-dropdown-item>
          <b-dropdown-item to="/demo/heroes">HEROES</b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item mr-5">
          <router-link class="nav-link" to="/demo/changelog">CHANGE LOG</router-link>
        </li>
      </ul>
      <div class="play">
        <a
          class="d-flex btn"
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=1146215215"
        >PLAY NOW</a>
      </div>
    </nav>
  </header>
</template>

<script>
import SidebarToggle from "./SidebarToggle.vue";
export default {
  components: {
    SidebarToggle
  }
};
</script>

<style></style>
