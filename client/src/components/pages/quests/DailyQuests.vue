<template>
  <div class="content">
    <h3 class="mb-5 text-center">Daily Quests</h3>
    <div class="quest container p-0">
      <div class="row">
        <div
          v-for="quest in quests"
          :key="quest.quest_id"
          class="col-sm-12 col-md-12 col-lg-4 col-xl-4"
        >
          <div class="single-quest">
            <p>
              {{ quest.quest_name | parseQuestText(quest.required_amount) }}
            </p>
            <div class="achievement-progress">
              <div
                class="user-progress"
                :style="`width:${getProgressPercent(quest)}%;`"
              ></div>
            </div>
          </div>
          <div class="quest-xp">
            <div class="quest-rewards">
              <span v-if="quest.poggers_reward > 0" class="pog-text mr-3"
                >{{ quest.poggers_reward }} POGGER</span
              >
              <span v-if="quest.xp_reward > 0" class="quest-xp-text"
                >{{ quest.xp_reward }} XP</span
              >
            </div>
            <a v-on:click="rerollQuest(quest)" class="reroll-button">
              <img src="./reroll.svg" alt />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    quests: [],
  }),

  mounted() {
    this.getDailyQuests();
  },

  methods: {
    getProgressPercent(quest) {
      const progress = quest.quest_progress;
      const required = quest.required_amount;

      const percent = Math.min((progress * 100) / required, 100);
      return percent;
    },
    getDailyQuests() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/daily_quests`)
        .then(res => res.json())
        .then(quests => {
          this.quests = quests;
        });
    },
    rerollQuest(quest) {
      const { quest_id } = quest;
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/daily_quests/reroll?questID=${quest_id}`,
        {
          method: "post",
        }
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // refresh the daily quests
            this.getDailyQuests();
          }
        });
    },
  },
};
</script>

<style>
.reroll-button {
  cursor: pointer;
}

.user-progress {
  background-image: linear-gradient(to right, #0b86c4, #42728a);
  height: 20px;
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

.quest-rewards {
  position: absolute;
  bottom: 15px;
  left: 35px;
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

.quest-xp img {
  position: absolute;
  right: 35px;
  bottom: 10px;
}

.user-progress {
  background-image: linear-gradient(to right, #0b86c4, #42728a);
}

.pog-text {
  background-image: linear-gradient(to bottom, #53b5e7 11%, #b3b9bf 83%);
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
