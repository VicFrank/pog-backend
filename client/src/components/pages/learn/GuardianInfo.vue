<template>
  <div class="abilities">
    <div class="guardian-titles">
      <div class="guardian-name">{{ $t(`guardians.${guardianData.name}`) }}</div>
      <div class="h4">{{ $t(`guardians.${guardianData.name}_title`) }}</div>
    </div>
    <img :src="guardianData.img" :alt="guardianData.name" class="guardian-image" fluid />
    <div class="abilities-list">
      <img
        v-for="ability in guardianData.abilities"
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
      <img :src="abilityImage(currentAbility)" :alt="currentAbility.name" class="current-ability" />
      <div class="ability-text">
        <h3 class="ability-name">{{ $t(`guardians.${currentAbility.name}`) }}</h3>
        <div class="ability-description">{{ $t(`guardians.${currentAbility.name}_description`) }}</div>
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
}

.guardian-titles {
  line-height: normal;
  text-align: center;
}

.guardian-image {
  width: 600px;
  height: auto;
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
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
}

.ability-info {
  display: flex;
  min-height: 120px;
}

.current-ability {
  width: 100px;
  height: 100px;
  border: 1px solid black;

  margin-right: 20px;
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
