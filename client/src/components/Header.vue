<template>
  <header id="main-nav">
    <div class="container p-0">
      <nav class="navbar navbar-expand-lg">
        <router-link to="/" class="navbar-brand" href="#">
          <img src="../assets/images/logo.svg" alt="POG" />
        </router-link>
        <ul class="navbar-nav mx-auto flex-row d-none d-lg-flex">
          <!-- <li class="nav-item mr-5">
            <router-link class="nav-link" to="/Learn">LEARN</router-link>
          </li>-->
          <li class="nav-item mr-5">
            <router-link class="nav-link" to="/Store">COSMETICS</router-link>
          </li>
          <li class="nav-item mr-5">
            <router-link class="nav-link" to="/Stats">STATS</router-link>
          </li>
          <li class="nav-item mr-5">
            <router-link class="nav-link" to="/Changelog">CHANGE LOG</router-link>
          </li>
        </ul>

        <div class="play">
          <a
            class="d-flex btn"
            href="https://steamcommunity.com/sharedfiles/filedetails/?id=1146215215"
          >PLAY NOW</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style>
</style>