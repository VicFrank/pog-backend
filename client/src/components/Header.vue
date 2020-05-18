<template>
  <header id="main-nav">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <SidebarToggle class="navbar-nav mr-1"></SidebarToggle>
        <router-link to="/" class="navbar-brand">
          <img src="../assets/images/logo_beta.png" alt="POG" />
        </router-link>
      </div>
      <ul class="navbar-nav mx-auto flex-row d-none d-lg-flex text-uppercase">
        <b-nav-item-dropdown class="mr-5">
          <template slot="button-content">{{ $t("navigation.learn") }}</template>
          <b-dropdown-item to="/faq">
            {{
            $t("navigation.faq")
            }}
          </b-dropdown-item>
          <b-dropdown-item to="/guardians">
            {{
            $t("navigation.guardians")
            }}
          </b-dropdown-item>
          <b-dropdown-item to="/media">
            {{
            $t("navigation.videos")
            }}
          </b-dropdown-item>
          <b-dropdown-item to="/chest_rates">
            {{
            $t("navigation.chest_drops")
            }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item mr-5">
          <router-link class="nav-link" to="/store">
            {{
            $t("navigation.store")
            }}
          </router-link>
        </li>
        <b-nav-item-dropdown text="STATS" class="mr-5">
          <template slot="button-content">{{ $t("navigation.stats") }}</template>
          <b-dropdown-item to="/games">
            {{
            $t("navigation.games")
            }}
          </b-dropdown-item>
          <b-dropdown-item to="/heroes">
            {{
            $t("navigation.heroes")
            }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item">
          <router-link class="nav-link" to="/changelog">
            {{
            $t("navigation.change_log")
            }}
          </router-link>
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

        <div class="d-flex align-items-center">
          <b-dropdown
            size="sm"
            variant="outline-secondary"
            class="mr-2"
            :text="$t('navigation.language')"
          >
            <b-dropdown-item
              v-for="(lang, i) in langs"
              :key="`Lang${i}`"
              :value="lang"
              @click="$i18n.locale = lang; $store.dispatch('setLanguage', lang);"
            >{{ $t(`navigation.${lang}`) }}</b-dropdown-item>
          </b-dropdown>

          <div>
            <b-button
              class="d-none d-md-flex mr-3"
              href="https://www.reddit.com/r/DotaCinema/comments/gaw4ah/pog_bug_report_megathread/"
              target="_blank"
              variant="secondary"
              v-t="'navigation.report_a_bug'"
            ></b-button>
          </div>
          <div>
            <b-button
              class="d-flex"
              href="https://steamcommunity.com/sharedfiles/filedetails/?id=2077900442"
              target="_blank"
              variant="primary"
              v-t="'navigation.play_now'"
            >PLAY NOW</b-button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import SidebarToggle from "./SidebarToggle.vue";
export default {
  components: {
    SidebarToggle
  },

  data: () => ({ langs: ["en", "ru", "cn"], selected: null }),

  created() {
    const lang = this.$route.query.lang;
    if (this.langs.includes(lang)) {
      this.$root._i18n._vm.locale = lang.toLowerCase();
    }
  }
};
</script>

<style>
.btn-sm {
  padding: 0.25rem !important;
  font-size: 0.65rem !important;
  border-radius: 0.2rem !important;
}
</style>
