<template>
  <div class="main-layout__sidebar">
    <div class="sidebar-content">
      <template v-if="loggedIn">
        <div class="user-info">
          <router-link to="/profile">
            <h3>
              {{ username }}
              <span v-if="isAdmin">(Admin)</span>
            </h3>
            <div class="profile-picture-container">
              <img
                :src="profilePicture"
                v-bind:style="borderStyle"
                class="profile-picture"
                alt="Profile Picture"
              />
              <div class="notification">
                <span class="custom-badge">{{ bpLevel }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <div class="d-flex justify-content-center align-items-center mt-1">
          <img
            :src="badgeImage"
            class="custom-badge-img"
            alt="Battle Pass Badge"
            v-b-tooltip.hover
            title="Badge"
          />
          <img
            v-if="bpTier === 1"
            src="../assets/images/bp_tier1.png"
            class="custom-badge-img"
            alt="Battle Pass Badge"
            v-b-tooltip.hover
            title="Tier 1"
          />
          <img
            v-if="bpTier === 2"
            src="../assets/images/bp_tier2.png"
            class="custom-badge-img"
            alt="Battle Pass Badge"
            v-b-tooltip.hover
            title="Tier 2"
          />
        </div>

        <div class="row">
          <ProgressBar
            class="bp-progress mt-1"
            :progress="bpLevelProgress"
            :required="bpLevelRequired"
          />
        </div>

        <div class="d-flex justify-content-center align-items-center mt-1">
          <img src="../assets/images/pogcoin_gold.png" class="poggers-img mr-1" alt="Poggers" />
          {{poggers}}
        </div>

        <ul class="sidebar-nav">
          <li class="sidebar-nav__item">
            <router-link
              to="/profile"
              class="sidebar-nav__link sidebar-nav__link_profile"
              exact-active-class="active"
            >Profile</router-link>
          </li>

          <li class="sidebar-nav__item">
            <router-link
              to="/profile/battle_pass"
              class="sidebar-nav__link sidebar-nav__link_battlepass"
              exact-active-class="active"
            >Battle Pass</router-link>
          </li>

          <li class="sidebar-nav__item">
            <router-link
              to="/profile/armory"
              class="sidebar-nav__link sidebar-nav__link_armory"
              exact-active-class="active"
            >Armory</router-link>
          </li>

          <li class="sidebar-nav__item">
            <router-link
              to="/profile/achievements"
              class="sidebar-nav__link sidebar-nav__link_achievements"
              exact-active-class="active"
            >
              Achievements
              <b-badge v-if="numAchievements > 0" variant="primary" class="ml-1">
                {{numAchievements}}
                <span class="sr-only">unclaimed achievements</span>
              </b-badge>
            </router-link>
          </li>
          <li class="sidebar-nav__item">
            <router-link
              to="/profile/stats"
              class="sidebar-nav__link sidebar-nav__link_stats"
              exact-active-class="active"
            >My Stats</router-link>
          </li>
          <li class="sidebar-nav__item">
            <router-link
              to="/profile/games"
              class="sidebar-nav__link sidebar-nav__link_history"
              exact-active-class="active"
            >Match History</router-link>
          </li>
          <li v-if="isAdmin" class="sidebar-nav__item">
            <router-link to="/admin" class="sidebar-nav__link sidebar-nav__link_settings">Admin</router-link>
          </li>
          <li>
            <b-button
              href="/api/auth/logout"
              class="sign-out-button mt-3"
              variant="outline-primary"
            >Sign Out</b-button>
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="login-button">
          <LoginButton></LoginButton>
        </div>
        <img src="../assets/images/login_sample.jpg" />
      </template>
      <hr class="d-lg-none" />
      <ul class="sidebar-nav">
        <li class="sidebar-nav__item d-lg-none">
          <router-link to="/store" class="sidebar-nav__link" exact-active-class="active">Store</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link to="/games" class="sidebar-nav__link" exact-active-class="active">Games</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link to="/heroes" class="sidebar-nav__link" exact-active-class="active">Heroes</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link
            to="/changelog"
            class="sidebar-nav__link"
            exact-active-class="active"
          >Changelog</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link to="/faq" class="sidebar-nav__link" exact-active-class="active">FAQ</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link
            to="/guardians"
            class="sidebar-nav__link"
            exact-active-class="active"
          >Guardians</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link to="/media" class="sidebar-nav__link" exact-active-class="active">Videos</router-link>
        </li>
        <li class="sidebar-nav__item d-lg-none">
          <router-link
            to="/chest_rates"
            class="sidebar-nav__link"
            exact-active-class="active"
          >Chest Drops</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { TweenMax, Power4 } from "gsap";
import LoginButton from "./pages/login/LoginButton";
import ProgressBar from "./utility/ProgressBar";

export default {
  name: "sidebar",

  data: () => ({}),

  components: {
    LoginButton,
    ProgressBar
  },

  mounted() {
    const open = this.$store.state.ui.sidebarOpen;
    TweenMax.set(this.$el, {
      x: open ? 0 : -this.$el.offsetWidth
    });
  },
  computed: {
    borderStyle() {
      if (this.bpLevel < 10) {
        // no border
        return {
          borderStyle: "solid",
          borderColor: "white",
          borderWidth: "1px"
        };
      } else if (this.bpLevel < 30) {
        // border1
        return {
          borderStyle: "solid",
          borderColor: "#4B69FF",
          borderWidth: "1px"
        };
      } else if (this.bpLevel < 50) {
        // border2
        return {
          borderStyle: "solid",
          borderColor: "#8847FF",
          borderWidth: "1px"
        };
      } else if (this.bpLevel < 70) {
        // border3
        return {
          borderStyle: "solid",
          borderColor: "#D32CE6",
          borderWidth: "1px"
        };
      } else if (this.bpLevel < 90) {
        // border4
        return {
          borderStyle: "solid",
          borderColor: "#EFAA15",
          borderWidth: "1px"
        };
      } else {
        // border5
        return {
          borderStyle: "solid",
          borderColor: "#EFAA15",
          borderWidth: "1px"
        };
      }
    },
    open() {
      return this.$store.state.ui.sidebarOpen;
    },
    username() {
      return this.$store.state.auth.username;
    },
    profilePicture() {
      return this.$store.state.auth.profilePictureLink;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    bpLevel() {
      return this.$store.getters.bpLevel;
    },
    bpLevelProgress() {
      return this.$store.getters.bpLevelProgress;
    },
    bpLevelRequired() {
      return this.$store.getters.bpLevelRequired;
    },
    bpTier() {
      return this.$store.getters.bpTier;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    poggers() {
      return this.$store.getters.poggers;
    },
    numAchievements() {
      return this.$store.getters.achievementsToClaim;
    },
    badgeImage() {
      const level = this.$store.getters.bpLevel;
      let badgeLevel = 1;
      if (level >= 100) {
        badgeLevel = 5;
      } else if (level >= 75) {
        badgeLevel = 4;
      } else if (level >= 55) {
        badgeLevel = 3;
      } else if (level >= 25) {
        badgeLevel = 2;
      } else {
        badgeLevel = 1;
      }
      return require(`../assets/images/badges/badge${badgeLevel}.png`);
    }
  },
  watch: {
    open: function(open) {
      const dX = open ? 0 : -this.$el.offsetWidth;
      TweenMax.to(this.$el, 0.6, {
        x: dX,
        ease: Power4.easeOut
      });
    }
  }
};
</script>

<style>
.main-layout__sidebar {
  width: 220px;
  position: fixed;
  height: 100%;
  z-index: 5;
  border-right: 1px solid rgba(44, 133, 199, 0.2);
  background-color: #13171d;
}

.main-layout__sidebar {
  top: 0;
  z-index: 5;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.main-layout__sidebar {
  top: 0;
  z-index: 5;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.sidebar-content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  height: 100%;
}

.login-button {
  text-align: center;
  margin-top: 80px;
}

.sign-out-button {
  width: 80%;
  margin: auto;
  background-color: transparent !important;
  display: block;
}

.sidebar-content .user-info {
  margin-top: 100px;
}

.profile-picture-container {
  position: relative;
}

.profile-picture {
  height: 150px;
  width: 150px;
  display: block;
  margin: 0 auto;
}

.sidebar-content h3 {
  font-size: 22px;
  font-weight: 600;
  font-family: "Radiance-Semibold";
  letter-spacing: 1px;
  text-align: center;
  color: #0b86c4;
}

.sidebar-nav {
  width: 100%;
  margin: 25px 0 0 0;
  padding: 0;
}

.sidebar-nav__item {
  position: relative;
}

.sidebar-nav__link {
  position: relative;
  letter-spacing: 1px;
  display: flex;
  padding: 14px 8px 14px 55px;
  transition: 0.2s ease;
  color: #fff;
}

.sidebar-nav__link:after,
.sidebar-nav__link:before {
  content: "";
}

.sidebar-nav__link:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-left: 3px solid #0b86c4;
  background: linear-gradient(
    90deg,
    rgba(83, 169, 255, 0.1) 0%,
    rgba(83, 169, 255, 0.0001) 100%,
    rgba(83, 169, 255, 0.1) 100%
  );
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease;
}

.sidebar-nav__link:before {
  position: absolute;
  left: 20px;
  top: -3px;
  bottom: 0;
  margin: auto 14px auto 0;
  background-size: 100%;
}

.sidebar-nav__link.active {
  color: #0b86c4;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 1px;
  text-decoration: none;
}

.sidebar-nav__link.active:after {
  opacity: 1;
  visibility: visible;
}

.sidebar-nav__link:hover:not(.active) {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 1px;
}

.sidebar-nav__link:hover:not(.active):after {
  content: "";
  opacity: 1;
  visibility: visible;
}

.notification {
  position: absolute;
  text-align: center;

  width: 30px;
  height: 30px;
  bottom: -12px;
  right: 20px;

  background-color: #0b86c4;
  border-radius: 50%;

  float: right;
}

.custom-badge-img {
  width: 40px;
  height: 40px;
}

.poggers-img {
  width: 24px;
  height: 24px;
}

.bp-progress {
  margin: auto;
  width: 75%;
}

.custom-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px !important;

  text-shadow: 1px 1px black;
  color: white;
}

.sidebar-nav__link_profile:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/profile.png");
}

.sidebar-nav__link_battlepass:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/book.svg");
}

.sidebar-nav__link_armory:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/columns.svg");
}

.sidebar-nav__link_battlepass:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/book.svg");
}

.sidebar-nav__link_achievements:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/gift.svg");
}

.sidebar-nav__link_dailyquest:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/calendar-alt.svg");
}

.sidebar-nav__link_stats:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/chart-bar.svg");
}

.sidebar-nav__link_friends:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/users.svg");
}

.sidebar-nav__link_settings:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/cog.svg");
}

.sidebar-nav__link_history:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("../assets/images/history.svg");
}
</style>
