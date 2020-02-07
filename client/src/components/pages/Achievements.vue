<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Achievements</h1>
      <div class="container">
        <div class="row" v-for="quest in achievements" :key="quest.quest_id">
          <div class="col-xl-12">
            <div class="achievement">
              <div class="achievement-row">
                <div class="description">
                  <h3>{{ quest.quest_name }}</h3>
                  <p class="achievement-description">
                    {{
                      quest.quest_description
                        | parseQuestText(quest.required_amount)
                    }}
                  </p>
                </div>
                <div class="rewards">
                  <p class="pog-text">{{ quest.poggers_reward }} POGGERS</p>
                  <p class="quest-xp-text">{{ quest.xp_reward }} XP</p>
                </div>
              </div>
              <div class="achievement-progress">
                <div
                  class="user-progress"
                  :style="`width:${getProgressPercent(quest)}%;`"
                ></div>
              </div>
            </div>
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
    achievements: [],
  }),

  mounted() {
    this.getAchievements();
  },

  methods: {
    getProgressPercent(quest) {
      const progress = quest.quest_progress;
      const required = quest.required_amount;

      const percent = Math.min((progress * 100) / required, 100);
      return percent;
    },
    getAchievements() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/achievements`)
        .then(res => res.json())
        .then(quests => {
          this.achievements = quests;
          console.log(quests);
        });
    },
  },
};
</script>

<style>
.achievement {
  position: relative;
  margin: 0.75em auto;
  padding: 2em 4em;
  border: solid 1.1px #364552;
  /* border: solid 1px #202e3a;
    background-color: #172126; */
  background-color: #222e3b;
}

.achievement h3 {
  font-family: "Radiance-Semibold";
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  text-transform: uppercase;
}

.achievement-description {
  font-size: 18px;
  color: #fcfcfc;
}

.achievement-row {
  display: flex;
}

.description {
  width: 75%;
}

.rewards {
  width: 25%;
}

.achievement-progress {
  background-color: rgba(188, 188, 188, 0.3);
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
  line-height: 1;
  letter-spacing: 0.5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
