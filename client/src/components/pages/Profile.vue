<template>
  <div class="main-layout__content">
    <div class="content">
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <GuardianPoll :pollID="2" class="mb-5" />
            <DailyQuests></DailyQuests>
            <WeeklyQuests v-if="bpTier > 1" class="mt-5"></WeeklyQuests>

            <div class="match-history position-relative">
              <h3
                class="mt-5 mb-5 text-center"
                v-t="'profile.match_history'"
              ></h3>

              <PlayerGamesList
                v-bind:games="games"
                :loading="gamesLoading"
                :showMMR="bpTier > 1"
              ></PlayerGamesList>

              <div class="more">
                <router-link
                  to="/profile/games"
                  class="blue"
                  v-t="'profile.view_all'"
                ></router-link>
              </div>
            </div>

            <div class="my-stats position-relative">
              <h3 class="mt-5 mb-5 text-center" v-t="'profile.my_stats'"></h3>
              <table class="table mb-5">
                <tbody>
                  <tr>
                    <td class="tb-head" v-t="'profile.mmr'"></td>
                    <td class="tb-head" v-t="'profile.wins'"></td>
                    <td class="tb-head" v-t="'profile.losses'"></td>
                    <td class="tb-head" v-t="'profile.abandoned'"></td>
                    <td class="tb-head" v-t="'profile.time_played'"></td>
                  </tr>
                  <tr>
                    <td>{{ playerStats.mmr }}</td>
                    <td>{{ playerStats.wins }}</td>
                    <td>{{ playerStats.losses }}</td>
                    <td>{{ playerStats.abandoned }}</td>
                    <td>{{ playerStats.time_played | duration }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="more">
                <router-link
                  to="/profile/stats"
                  class="blue"
                  v-t="'profile.view_all'"
                ></router-link>
              </div>
            </div>

            <div class="position-relative" v-if="bpTier >= 2">
              <h3 class="mt-5 mb-5 text-center" v-t="'profile.hero_stats'"></h3>
              <PlayerHeroStatsList :numItems="3" :steamID="steamID" />
              <div class="more">
                <router-link
                  to="/profile/stats"
                  class="blue"
                  v-t="'profile.view_all'"
                ></router-link>
              </div>
            </div>

            <h3 class="mt-5 mb-5 text-center" v-t="'profile.daily_xp'"></h3>
            <div class="daily-xp mb-5">
              <div class="text-center">
                <div v-if="bpTier > 0">
                  {{ $t("profile.current_booster") }}
                  <img
                    v-if="bpTier === 1"
                    src="../../assets/images/bp_tier1.png"
                    class="booster"
                    alt="Booster 1"
                  />
                  <img
                    v-if="bpTier === 2"
                    src="../../assets/images/bp_tier2.png"
                    class="booster"
                    alt="Booster 2"
                  />
                </div>
                <div v-else class="my-1">
                  <i18n path="profile.bp_sellout">
                    <template v-slot:link>
                      <router-link to="/store">
                        {{ $t("profile.bp_sellout_link") }}
                      </router-link>
                    </template>
                  </i18n>
                </div>
                <div class="text-muted">
                  {{ $t("profile.reset_in") }} {{ secondsUntilReset | hhmmss }}
                </div>
              </div>
              <ProgressBar
                class="mt-3"
                :progress="Number(dailyXP)"
                :required="maxDailyXP"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DailyQuests from "./quests/DailyQuests";
import WeeklyQuests from "./quests/WeeklyQuests";
import PlayerGamesList from "./games/PlayerGamesList";
import PlayerHeroStatsList from "./games/PlayerHeroStatsList";
import ProgressBar from "../utility/ProgressBar";
import GuardianPoll from "../polls/GuardianPoll";

export default {
  components: {
    DailyQuests,
    WeeklyQuests,
    PlayerGamesList,
    PlayerHeroStatsList,
    ProgressBar,
    GuardianPoll,
  },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    gamesLoading: true,
    secondsUntilReset: 0,
  }),

  computed: {
    bpTier() {
      return this.$store.getters.bpTier;
    },
    dailyXP() {
      return this.$store.getters.dailyXP;
    },
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    maxDailyXP() {
      switch (this.bpTier) {
        case 0:
          return 1200;
        case 1:
          return 2300;
        case 2:
          return 4400;
      }
      return 0;
    },
  },

  methods: {
    startCountdown(seconds) {
      this.secondsUntilReset = seconds;
      this.countDownTimer();
    },
    countDownTimer() {
      if (this.secondsUntilReset > 0) {
        setTimeout(() => {
          this.secondsUntilReset -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/games?limit=3`)
      .then((res) => res.json())
      .then((games) => {
        this.gamesLoading = false;
        this.games = games;
      });

    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.playerStats = playerStats;
        this.startCountdown(playerStats.seconds_to_reset);
      });
  },
};
</script>

<style scoped>
.daily-xp {
  height: 100px;
  border: solid 1.1px #364552;
  background-color: #222e3b;
}

.booster {
  height: 30px;
}
</style>
