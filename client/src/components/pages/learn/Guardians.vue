<template>
  <div class="container">
    <h1 class="page-title">Guardians</h1>
    <GuardianInfo
      v-for="guardian in guardians"
      :key="guardian.name"
      :guardianData="guardian"
    />
  </div>
</template>

<script>
import GuardianInfo from "./GuardianInfo.vue";

export default {
  components: {
    GuardianInfo,
  },

  data: () => ({
    guardians: [
      {
        name: "Monkey",
        title: "Guardian of War",
        img: require("./images/guardian_01.png"),
        abilities: [
          {
            name: "Monkey Business",
            image: "guardian_monkeybusiness.png",
            description:
              "Monkeys occasionally attack by throwing poop. Affected enemies are disgusted for the duration, attacking and moving slower and taking damage over time.",
          },
          {
            name: "Gang Up",
            image: "guardian_gangup.png",
            description:
              "If two or more heroes attack Monkey, she summons three mini-monkeys to help her cause. Mini-monkeys also have Monkey Business.",
          },
          {
            name: "Spell Block",
            image: "spell_block.png",
            description:
              "Blocks one targeted spell every 15 seconds. Also adds 25% status reistance.",
          },
          {
            name: "Artifact - Shattered Helm",
            image: "guardian_buff_shatterd_helm.png",
            description: `Upon death, the team that slays Monkey receives an Artifact belonging to the Guardian of War for 5 minutes.
              Effects: +50% damage, health, and attack speed to allied creeps.`,
          },
        ],
      },
      {
        name: "Pooky",
        title: "Guardian of Power",
        img: require("./images/guardian_02.png"),
        abilities: [
          {
            name: "Obese Reality",
            image: "guardian_obese_reality.png",
            description:
              "Pooky channels her inner lard resulting in a frenzy of attacks. Her attack speed is increased by 200 for 8 seconds.",
          },
          {
            name: "Cleavage",
            image: "guardian_cleavage.png",
            description:
              "Pooky uses extra blubber in her attacks to make sure all her enemies feel her fatness, thus dealing 175% cleave damage to enemies.",
          },
          {
            name: "Spell Block",
            image: "spell_block.png",
            description:
              "Blocks one targeted spell every 15 seconds. Also adds 25% status reistance.",
          },
          {
            name: "Artifact - Sacred Flame",
            image: "guardian_buff_sacredflame.png",
            description: `Upon death, the team that slays Pooky will receive an Artifact belonging to the Guardian of Power for 5 minutes.
            \nEffects: +25% damage amplification to allied heroes`,
          },
        ],
      },
      {
        name: "Bucket",
        title: "Guardian of Time",
        img: require("./images/guardian_03.png"),
        abilities: [
          {
            name: "Tea Time",
            image: "guardian_teaspill.png",
            description:
              "When more than one enemy is within reach of Bucket, he will spill his tea in an area around him. The tea deals damage over time and slows enemy movement speed. Each time this is cast, the cooldown will be reduced. Cooldown will be reset to default after 30 seconds of inactivity.",
          },
          {
            name: "Spell Block",
            image: "spell_block.png",
            description:
              "Blocks one targeted spell every 15 seconds. Also adds 25% status reistance.",
          },
          {
            name: "Artifact - Ashes of the Codex",
            image: "guardian_buff_codex.png",
            description: `Upon death, the team that slays Bucket will receive an Artifact belonging to the Guardian of Time for 5 minutes.
              Effects: 25% cooldown reduction for all allied heroes.`,
          },
        ],
      },
    ],
  }),
};
</script>

<style></style>
