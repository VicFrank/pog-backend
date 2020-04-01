<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Battle Pass</h1>
      <ul class="battlepass-timeline">
        <li v-for="i in 100" :key="i">
          <div v-bind:class="{ 'direction-r': isEven(i), 'direction-l': !isEven(i) }">
            <span>Level {{i}}</span>
            <div v-bind:class="{ 'lvl-wrapper': true, 'lvl-locked': i > bpLevel }">
              <img :src="getImgUrl(i)" @click="$bvModal.show(`bp-modal-${i}`)" :alt="`Level ${i}`" />

              <b-modal :id="`bp-modal-${i}`" :title="`Level ${i} Reward`" centered hide-footer>
                <div v-if="hasItemReward(i)" class="reward">
                  <img
                    v-if="getItemImage(i)"
                    class="reward-image"
                    v-bind:src="getItemImage(i)"
                    :alt="getRewardItem(i)"
                  />
                  {{getRewardItem(i)}}
                </div>
                <div v-if="getChestAmount(i) > 0" class="reward">
                  <img class="reward-image" v-bind:src="getChestImage(i)" alt="Chest Image" />
                  <span v-if="getChestAmount(i) > 1">{{getChestAmount(i)}}x</span>
                  {{getRewards(i).chest_type}}
                  <template
                    v-if="getChestAmount(i) === 1"
                  >Chest</template>
                  <template v-else>Chests</template>
                </div>
              </b-modal>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import rewards from "./battlePassRewards";

export default {
  computed: {
    bpLevel() {
      return this.$store.state.auth.bpLevel;
    }
  },
  methods: {
    isEven(number) {
      return number % 2 === 0;
    },
    getImgUrl(number) {
      const level = (number % 5) + 1;
      return require(`./lvl${level}.svg`);
    },
    getRewards(level) {
      return rewards[level - 1];
    },
    getRewardItem(level) {
      return rewards[level - 1].item;
    },
    hasItemReward(level) {
      return rewards[level - 1].item !== "";
    },
    getChestAmount(level) {
      return rewards[level - 1].chest_amount;
    },
    getItemImage(level) {
      const imageName = rewards[level - 1].item_image;
      if (!imageName || imageName === "") return false;

      return require(`./rewards/${imageName}.png`);
    },
    getChestImage(level) {
      const chestType = rewards[level - 1].chest_type.toLowerCase();

      return require(`./rewards/chest_${chestType}.png`);
    }
  }
};
</script>

<style>
.modal-content {
  /* color: #212529; */
  background-color: #13171d;
}

.close {
  color: white;
}

.modal-backdrop {
  opacity: 0.5;
}

.modal-title {
  font-size: 36px;
}

.reward {
  text-align: center;
  margin-bottom: 10px;

  font-size: 24px;
}

.reward-image {
  width: auto;
  height: 30px;
}

.battlepass-timeline {
  position: relative;
  width: 960px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 1em 0;
  list-style-type: none;
}

.battlepass-timeline:before {
  position: absolute;
  left: 50%;
  top: 0;
  content: " ";
  display: block;
  width: 6px;
  height: 100%;
  margin-left: -3px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 5;
}

.battlepass-timeline li:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.direction-l {
  position: relative;
  width: 300px;
  float: left;
  text-align: right;
}

.direction-l:before {
  position: absolute;
  left: 129%;
  top: -14px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 178px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 4;
}

.direction-l span {
  position: relative;
  left: 48%;
  bottom: -31px;
  font-size: 32px;
  color: #fcfcfc;
}

.direction-r {
  position: relative;
  width: 300px;
  float: right;
}

.direction-r:before {
  position: absolute;
  right: 129%;
  top: -14px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 178px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 4;
}

.direction-r span {
  position: relative;
  right: 48%;
  bottom: -31px;
  font-size: 32px;
  color: #fcfcfc;
}

.lvl-wrapper {
  position: relative;
  display: inline-block;
  text-align: center;
  top: -1em;
  box-shadow: 0 0 30px 0 rgba(11, 134, 196, 0.3);

  cursor: pointer;
}

.lvl-wrapper img {
  height: 150px;
}

.lvl-locked {
  box-shadow: unset;
  filter: grayscale(100%);
}
</style>
