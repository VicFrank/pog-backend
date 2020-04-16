<template>
  <div class="abilities">
    <div class="guardian-titles">
      <div class="guardian-name">{{guardianData.name}}</div>
      <div class="guardian-title">{{guardianData.title}}</div>
    </div>
    <div class="abilities-list">
      <img
        v-for="ability in guardianData.abilities"
        :key="ability.name"
        :src="abilityImage(ability)"
        :alt="ability.name"
        v-bind:class="{ 
            'ability-image': true, 
            'active-image': ability.name === currentAbility.name }"
        v-on:click="setCurrentAbility(ability)"
      />
    </div>

    <div class="ability-info">
      <img :src="abilityImage(currentAbility)" alt="Shattered Helm" class="current-ability" />
      <div class="ability-text">
        <h3 class="ability-name">{{currentAbility.name}}</h3>
        <div class="ability-description">{{currentAbility.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["guardianData"],

  data: () => ({
    currentAbility: {}
  }),

  mounted() {
    this.setCurrentAbility(this.guardianData.abilities[0]);
  },

  methods: {
    abilityImage(ability) {
      if (ability.image) return require(`./images/${ability.image}`);
      // have a default image incase ability.image is undefined
      return require("./images/spell_block.png");
    },
    setCurrentAbility(ability) {
      this.currentAbility = ability;
    }
  }
};
</script>

<style scoped>
.abilities {
  max-width: 600px;
  min-height: 300px;
  margin: auto;

  margin-top: 20px;
}

.guardian-titles {
  margin-bottom: 20px;
}

.abilities-list {
  display: flex;
  margin-bottom: 40px;
  margin-left: 120px;
}

.guardian-name {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #0b86c4;

  line-height: normal;
}

.guardian-title {
  font-size: 24px;

  line-height: normal;
}

.ability-image {
  width: 65px;
  height: 65px;
  margin-right: 20px;
  border: 1px solid black;

  filter: grayscale(100%);

  transition: 0.4s ease;
}

.ability-image:hover {
  filter: grayscale(0%);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
}

.active-image {
  filter: grayscale(0%);
}

.ability-info {
  display: flex;
  margin-bottom: 20px;
}

.current-ability {
  width: 100px;
  height: 100px;
  border: 1px solid black;

  margin-right: 20px;
}

.ability-text {
  width: 100%;
}

.ability-name {
  font-size: 36px;
  color: #0b86c4;
}

.ability-description {
  font-size: 1rem;
}
</style>