<template>
  <div class="container">
    <h1 class="page-title" v-t="'guardians.page_title'"></h1>
    <GuardianInfo v-for="guardian in guardians" :key="guardian.name" :guardianData="guardian" />
  </div>
</template>

<script>
import GuardianInfo from "./GuardianInfo.vue";

export default {
  components: {
    GuardianInfo
  },

  data: () => ({
    guardians: [
      {
        name: "monkey",
        img: require("./images/guardian_01.png"),
        abilities: [
          {
            name: "monkey_business",
            image: "guardian_monkeybusiness.png"
          },
          {
            name: "gang_up",
            image: "guardian_gangup.png"
          },
          {
            name: "spell_block",
            image: "spell_block.png"
          },
          {
            name: "shattered_helm",
            image: "guardian_buff_shatterd_helm.png"
          }
        ]
      },
      {
        name: "pooky",
        img: require("./images/guardian_02.png"),
        abilities: [
          {
            name: "obese_reality",
            image: "guardian_obese_reality.png"
          },
          {
            name: "cleavage",
            image: "guardian_cleavage.png"
          },
          {
            name: "spell_block",
            image: "spell_block.png"
          },
          {
            name: "sacred_flame",
            image: "guardian_buff_sacredflame.png"
          }
        ]
      },
      {
        name: "bucket",
        img: require("./images/guardian_03.png"),
        abilities: [
          {
            name: "tea_time",
            image: "guardian_teaspill.png"
          },
          {
            name: "spell_block",
            image: "spell_block.png"
          },
          {
            name: "ashes_of_codex",
            image: "guardian_buff_codex.png"
          }
        ]
      }
    ]
  })
};
</script>

<style></style>
