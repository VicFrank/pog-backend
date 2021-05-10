<template>
  <div class="container">
    <h1 class="page-title" v-t="'guardians.page_title'"></h1>
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
        name: "lulu",
        img: require("./images/guardian_04.png"),
        video: "https://www.youtube.com/embed/y2UJ8ZHoWfU",
        abilities: [
          {
            name: "weave",
            image: "guardian_weave.png",
          },
          {
            name: "insatiable_thirst",
            image: "guardian_insatiable_thirst.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "cursed_chalice",
            image: "guardian_buff_cursedchalice.png",
          },
        ],
      },
      {
        name: "monkey",
        img: require("./images/guardian_01.png"),
        video: "https://www.youtube.com/embed/FI7sirDX2uM",
        abilities: [
          {
            name: "monkey_business",
            image: "guardian_monkeybusiness.png",
          },
          {
            name: "gang_up",
            image: "guardian_gangup.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "shattered_helm",
            image: "guardian_buff_shatterd_helm.png",
          },
        ],
      },
      {
        name: "pooky",
        img: require("./images/guardian_02.png"),
        video: "https://www.youtube.com/embed/FI7sirDX2uM",
        abilities: [
          {
            name: "obese_reality",
            image: "guardian_obese_reality.png",
          },
          {
            name: "cleavage",
            image: "guardian_cleavage.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "sacred_flame",
            image: "guardian_buff_sacredflame.png",
          },
        ],
      },
      {
        name: "bucket",
        img: require("./images/guardian_03.png"),
        video: "https://www.youtube.com/embed/FI7sirDX2uM",
        abilities: [
          {
            name: "tea_time",
            image: "guardian_teaspill.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "ashes_of_codex",
            image: "guardian_buff_codex.png",
          },
        ],
      },
      {
        name: "fig",
        img: require("./images/guardian_05.png"),
        video: "https://www.youtube.com/embed/qBUvP-6PU2o",
        abilities: [
          {
            name: "bad_touch",
            image: "guardian_bad_touch.png",
          },
          {
            name: "taking_you_with_me",
            image: "guardian_taking_you_with_me.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "fig_buff",
            image: "guardian_buff_cross.png",
          },
        ],
      },
      {
        name: "log",
        // img: require("./images/guardian_05.png"),
        // video: "https://www.youtube.com/embed/qBUvP-6PU2o",
        abilities: [
          {
            name: "lard_incarnate",
            image: "guardian_lardincarnate.png",
          },
          {
            name: "bugle_mode",
            image: "guardian_buglemode.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "bugles_blessing",
            image: "guardian_buff_bugles_blessing.png",
          },
        ],
      },
      {
        name: "roo",
        // img: require("./images/guardian_05.png"),
        // video: "https://www.youtube.com/embed/qBUvP-6PU2o",
        abilities: [
          {
            name: "alot_of_armor",
            image: "guardian_lotofarmor.png",
          },
          {
            name: "chain_sheep",
            image: "guardian_chainsheep.png",
          },
          {
            name: "spell_block",
            image: "spell_block.png",
          },
          {
            name: "wizard_hat",
            image: "guardian_buff_wizardhat.png",
          },
        ],
      },
    ],
  }),
};
</script>

<style></style>
