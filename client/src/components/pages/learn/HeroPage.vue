<template>
  <div class="container">
    <h1 class="page-title">{{ heroData.name }}</h1>
    <div class="video my-5" v-if="videos[hero]">
      <b-embed type="iframe" :src="videos[hero]" allowfullscreen></b-embed>
    </div>

    <div class="abilities-list">
      <img
        v-for="ability in abilities"
        :key="ability.name"
        :src="abilityImage(ability)"
        :alt="ability.name"
        v-bind:class="{
          'ability-image': true,
          'active-image': ability.name === currentAbility.name,
        }"
        v-on:click="setCurrentAbility(ability)"
      />
    </div>

    <div class="ability-info">
      <img
        :src="abilityImage(currentAbility)"
        :alt="currentAbility.name"
        class="current-ability"
      />
      <div class="ability-text">
        <h3 class="ability-name">{{ currentAbility.name }}</h3>
        <div class="ability-description">{{ currentAbility.description }}</div>
        <div class="mt-1" v-for="stat in currentAbility.stats" :key="stat.stat">
          <span class="text-muted mt-1">{{ stat.stat }}:</span>
          {{ stat.values }}
        </div>
      </div>
    </div>

    <h3 class="text-center mt-3">Talents</h3>

    <div class="talent-box">
      <div class="talent-row">
        <div class="talent">{{ talents[6] }}</div>
        <div class="talent-level">25</div>
        <div class="talent">{{ talents[7] }}</div>
      </div>
      <div class="talent-row">
        <div class="talent">{{ talents[4] }}</div>
        <div class="talent-level">20</div>
        <div class="talent">{{ talents[5] }}</div>
      </div>
      <div class="talent-row">
        <div class="talent">{{ talents[2] }}</div>
        <div class="talent-level">15</div>
        <div class="talent">{{ talents[3] }}</div>
      </div>
      <div class="talent-row">
        <div class="talent">{{ talents[0] }}</div>
        <div class="talent-level">10</div>
        <div class="talent">{{ talents[1] }}</div>
      </div>
    </div>

    <div class="text-center my-3">
      <h3>Credits</h3>
      <div class="mt-1" v-for="credit in credits" :key="credit">
        {{ credit }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    hero: "",
    heroData: {},
    abilitiesList: [],
    abilities: [],
    talents: [],
    credits: [],
    currentAbility: {},

    videos: {
      mifune: "https://www.youtube.com/embed/oEMqCa5TZls",
      thunderboar: "https://www.youtube.com/embed/ihnveJGYqgM",
      pc: "https://www.youtube.com/embed/mgJdGaneTUo",
    },
  }),

  mounted() {
    this.hero = this.$route.params.hero;
    this.heroData = this.$t(`custom_heroes.${this.hero}`);

    this.abilities = this.heroData.abilities;
    this.talents = this.heroData.talents;
    this.credits = this.heroData.credits;

    if (!this.hero) {
      // bad route
    } else {
      this.setCurrentAbility(this.abilities[0]);
    }
  },

  methods: {
    abilityImage(ability) {
      if (ability.ability == "scepter") return require("./images/scepter.png");
      if (ability.ability == "shard")
        return require("./images/aghanims_shard.png");
      if (ability.ability)
        return require(`./images/${this.hero}_${ability.ability}.png`);
      // have a default image incase ability.image is undefined
      return require("./images/spell_block.png");
    },
    setCurrentAbility(ability) {
      this.currentAbility = ability;
    },
  },
};
</script>

<style scoped>
.video {
  max-width: 600px;
  margin: auto;
}

.abilities {
  max-width: 600px;
  min-height: 300px;
  margin: auto;

  margin-top: 20px;
}

.abilities-list {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.ability-image {
  width: 65px;
  height: 65px;
  margin-right: 20px;
  border: 1px solid black;

  filter: grayscale(100%);

  transition: 0.4s ease;

  cursor: pointer;
}

.ability-image:hover {
  filter: grayscale(0%);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
}

.active-image {
  filter: grayscale(0%);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
}

.ability-info {
  display: flex;
  margin: auto;
  min-height: 120px;

  padding: 1em 2em;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #1d2127;
  box-shadow: 0 4px #ccc;
  align-items: center;

  max-width: 600px;
}

.talent-box {
  margin: auto;
  min-height: 120px;

  padding: 0.5em 2em;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #1d2127;
  box-shadow: 0 4px #ccc;
  align-items: center;

  max-width: 700px;
}

.talent-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 10px;
  margin-bottom: 10px;
}

.talent:first-child {
  text-align: right;
}

.talent-level {
  width: 20%;
  text-align: center;
  font-size: 24px;
}

.talent {
  width: 40%;
}

.current-ability {
  align-self: flex-start;

  width: 100px;
  height: auto;
  border: 1px solid black;

  margin-right: 20px;
  margin-top: 50px;
}

.ability-text {
  width: 480px;
}

.ability-name {
  font-size: 36px;
  color: #0b86c4;
}

.ability-description {
  font-size: 1rem;
}

@media (max-width: 599px) {
  .abilities-list {
    margin-left: 0px;
  }
}
</style>