<template>
  <div class="main-layout__sidebar">
    <div class="sidebar-content">
      <div class="user-info">
        <h3>SUNSfan</h3>
        <router-link to="/Profile">
          <img src="../assets/images/sunsfan.svg" alt />
        </router-link>
        <div class="notification">
          <span class="custom-badge">4</span>
        </div>
      </div>

      <ul class="sidebar-nav">
        <li class="sidebar-nav__item">
          <router-link
            to="/"
            class="sidebar-nav__link sidebar-nav__link_battlepass"
            exact-active-class="active"
          >Battle Pass</router-link>
        </li>

        <li class="sidebar-nav__item">
          <router-link
            to="/Cosmetics"
            class="sidebar-nav__link sidebar-nav__link_armory"
            exact-active-class="active"
          >Cosmetics</router-link>
        </li>

        <li class="sidebar-nav__item">
          <router-link
            to="/Achievements"
            class="sidebar-nav__link sidebar-nav__link_achievements"
            exact-active-class="active"
          >Achievements</router-link>
        </li>
        <li class="sidebar-nav__item">
          <router-link
            to="/Quests"
            class="sidebar-nav__link sidebar-nav__link_dailyquest"
            exact-active-class="active"
          >Daily Quests</router-link>
        </li>
        <li class="sidebar-nav__item">
          <router-link
            to="/MyStats"
            class="sidebar-nav__link sidebar-nav__link_stats"
            exact-active-class="active"
          >My Stats</router-link>
        </li>
        <li class="sidebar-nav__item">
          <router-link
            to="/MatchHistory"
            class="sidebar-nav__link sidebar-nav__link_history"
            exact-active-class="active"
          >Match History</router-link>
        </li>
        <!-- <li class="sidebar-nav__item">
          <router-link
            to="/"
            class="sidebar-nav__link sidebar-nav__link_settings"
            >Settings</router-link
          >
        </li>-->
      </ul>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
