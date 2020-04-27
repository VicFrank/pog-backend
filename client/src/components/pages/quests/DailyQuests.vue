<template>
  <div class="content">
    <h3 class="mb-5 text-center">Daily Quests</h3>
    <div class="quest container p-0">
      <b-alert v-if="error != ''" show variant="danger" dismissible>{{error}}</b-alert>
      <div class="row">
        <div
          v-for="(quest, index) in quests"
          :key="quest.quest_id"
          class="col-sm-12 col-md-12 col-lg-4 col-xl-4"
        >
          <div class="single-quest">
            <p>{{ quest.quest_name | parseQuestText(quest.required_amount) }}</p>
            <button
              v-on:click="claimQuest(quest, index)"
              v-if="quest.quest_completed && !quest.claimed"
              type="button"
              class="btn btn-primary mb-3"
            >Claim</button>
            <ProgressBar :progress="quest.capped_quest_progress" :required="quest.required_amount" />
          </div>
          <div class="d-flex flex-row quest-xp">
            <div v-if="!quest.claimed" class="quest-rewards">
              <span v-if="quest.poggers_reward > 0" class="pog-text mr-3">
                <img class="pogcoin" src="../../../assets/images/pogcoin_gold.png" alt="Pog Coin" />
                {{ quest.poggers_reward }} POGGERS
              </span>
              <span v-if="quest.xp_reward > 0" class="quest-xp-text">{{ quest.xp_reward }} XP</span>
            </div>
            <div v-else class="quest-rewards">Completed</div>
            <a
              v-if="quest.can_reroll"
              v-on:click="rerollQuest(quest)"
              class="ml-auto mr-3 reroll-button"
            >
              <img src="./reroll.svg" alt="Reroll" />
            </a>
            <template v-else>
              <span class="ml-auto mr-2 next-quest-text">
                {{
                getTimeUntilReroll(quest.created)
                }}
              </span>
              <a v-on:click="rerollQuest(quest)" class="mr-3 reroll-button">
                <img class="faded" src="./reroll.svg" alt="Reroll" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ProgressBar from "../../utility/ProgressBar";

export default {
  data: () => ({
    error: "",
    quests: []
  }),

  components: {
    ProgressBar
  },

  created() {
    this.getDailyQuests();
  },

  methods: {
    getTimeUntilReroll(created) {
      const time = moment(created)
        .add(24, "hours")
        .fromNow();
      return `Can refresh ${time}`;
    },
    getDailyQuests() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/daily_quests`)
        .then(res => res.json())
        .then(quests => {
          this.quests = quests;
        })
        .catch(err => (this.error = err));
    },
    rerollQuest(quest, index) {
      const { quest_id } = quest;
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/daily_quests/reroll?questID=${quest_id}`,
        { method: "post" }
      )
        .then(res => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            this.quests = this.quests.splice(index);
            // refresh the daily quests
            this.getDailyQuests();
          }
        })
        .catch(err => (this.error = err));
    },
    claimQuest(quest, index) {
      const { quest_id } = quest;
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/daily_quests/claim?questID=${quest_id}`,
        { method: "post" }
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // remove this quest from the list, and
            this.quests = this.quests.splice(index);
            // refresh the daily quests
            this.getDailyQuests();
            this.$store.dispatch("refreshPlayer");
          }
        })
        .catch(err => (this.error = err));
    }
  }
};
</script>

<style>
.reroll-button {
  cursor: pointer;
  line-height: 43px;
}

.reroll-button .faded {
  opacity: 0.4;
  filter: alpha(opacity=40); /* msie */
  background-color: #000;
  border-radius: 100%;
}

.single-quest {
  /* border: solid 1px #202e3a; */
  border: solid 1.1px #364552;
  background-color: #222e3b;
  padding: 2em 1em;
  border-bottom: 0;
}

.single-quest p {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  font-family: "Radiance-Semibold";
}

.quest-xp {
  height: 50px;
  background-color: #1a232b;
  border: solid 1.1px #364552;
  border-top: 0;
  border-bottom: 3px solid #125478;
}

.next-quest-text {
  line-height: 50px;
}

.quest-rewards {
  padding: 1rem;
}

.quest-xp-text {
  background-image: linear-gradient(
    to bottom,
    #8f6b29 11%,
    #fde08d 46%,
    #df9f28 83%
  );
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pog-text {
  background-image: linear-gradient(to bottom, #53b5e7 11%, #b3b9bf 83%);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
