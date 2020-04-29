<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Battle Pass</h1>
      <ul class="battlepass-timeline">
        <li v-for="i in 100" :key="i">
          <div
            v-bind:class="{
              'direction-r': isEven(i),
              'direction-l': !isEven(i),
            }"
          >
            <span>Level {{ i }}</span>
            <div v-bind:class="{ 'lvl-wrapper': true, 'lvl-locked': i > bpLevel }">
              <template v-if="loading">
                <img src="./images/bp_placeholder.png" alt="placeholder" />
              </template>
              <template v-else>
                <img
                  v-if="getItemImage(i)"
                  :src="getItemImage(i)"
                  :alt="getRewardItem(i)"
                  @click="$bvModal.show(`bp-modal-${i}`)"
                />
                <img
                  v-for="j in getChestAmount(i)"
                  :key="i + ' ' + j"
                  v-bind:src="getChestImage(i)"
                  alt="Chest Image"
                  @click="$bvModal.show(getChestLevel(i))"
                />

                <b-modal :id="`bp-modal-${i}`" :title="getItemName(i)" centered hide-footer>
                  <video v-if="getMovie(i)" width="100%" height="360" autoplay muted loop>
                    <source :src="getMovie(i)" type="video/webm" />Your browser does not support the video tag.
                  </video>

                  <div class="text-center">
                    <div>
                      <img
                        v-if="getItemImage(i) && !getMovie(i)"
                        :src="getItemImage(i)"
                        :alt="getRewardItem(i)"
                        class="mb-2"
                      />
                    </div>

                    <template v-if="Array.isArray(getRewardDescription(i))">
                      {{getRewardDescription(i)[0]}}
                      <ul class="mt-1">
                        <li
                          v-for="line in getRewardDescription(i).slice(1)"
                          :key="line + cosmetic.cosmetic_id"
                        >{{line}}</li>
                      </ul>
                    </template>
                    <template v-else>{{getRewardDescription(i)}}</template>
                  </div>
                </b-modal>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <b-modal :id="'1'" title="Common Chest" centered hide-footer>
      <h5>Gain a free Common Chest! It contains the following prizes:</h5>
      <ul>
        <li v-for="reward in chestRewards['chest5']" :key="reward">{{reward}}</li>
      </ul>
    </b-modal>
    <b-modal :id="'2'" title="Uncommon Chest" centered hide-footer>
      <h5>Gain a free Uncommon Chest! It contains the following prizes:</h5>
      <ul>
        <li v-for="reward in chestRewards['chest5']" :key="reward">{{reward}}</li>
      </ul>
    </b-modal>
    <b-modal :id="'3'" title="Rare Chest" centered hide-footer>
      <h5>Gain a free Rare Chest! It contains the following prizes:</h5>
      <ul>
        <li v-for="reward in chestRewards['chest5']" :key="reward">{{reward}}</li>
      </ul>
    </b-modal>
    <b-modal :id="'4'" title="Mythical Chest" centered hide-footer>
      <h5>Gain a free Mythical Chest! It contains the following prizes:</h5>
      <ul>
        <li v-for="reward in chestRewards['chest5']" :key="reward">{{reward}}</li>
      </ul>
    </b-modal>
    <b-modal :id="'5'" title="Legendary Chest" centered hide-footer>
      <h5>Gain a free Legendary Chest! It contains the following prizes:</h5>
      <ul>
        <li v-for="reward in chestRewards['chest5']" :key="reward">{{reward}}</li>
      </ul>
    </b-modal>
  </div>
</template>

<script>
import names from "./cosmeticNames";
import webm from "./webmList";
import chestRewards from "./chests";

export default {
  data: () => ({
    error: "",
    rewards: [],
    loading: true,
    chestRewards
  }),

  created() {
    this.chestRewards = chestRewards;

    fetch(`/api/cosmetics/battle_pass`)
      .then(res => res.json())
      .then(rewards => {
        // remove level 0 from the rewards
        rewards.shift();
        this.rewards = rewards;
        this.loading = false;
      })
      .catch(err => (this.error = err));
  },

  computed: {
    bpLevel() {
      return this.$store.getters.bpLevel;
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
      return this.rewards[level - 1];
    },
    getRewardItem(level) {
      return this.rewards[level - 1].cosmetic_id;
    },
    getRewardDescription(level) {
      if (this.getRewardItem(level)) {
        return chestRewards[this.getRewardItem(level)];
      }
    },
    getItemName(level) {
      const cosmetic_id = this.rewards[level - 1].cosmetic_id;
      return names[cosmetic_id];
    },
    hasItemReward(level) {
      return this.rewards[level - 1].cosmetic_id !== null;
    },
    getChestAmount(level) {
      return this.rewards[level - 1].chest_amount;
    },
    getItemImage(level) {
      const cosmetic_id = this.rewards[level - 1].cosmetic_id;
      if (!cosmetic_id || cosmetic_id === null) return false;

      return require(`./images/${cosmetic_id}.png`);
    },
    getChestImage(level) {
      const chest = this.rewards[level - 1].chest;
      if (!chest || chest === null) return false;

      return require(`./images/chest${chest}.png`);
    },
    getChestMultiplierImage(level) {
      const chest = this.rewards[level - 1].chest;
      if (!chest || chest === null) return false;
      const amount = this.getChestAmount(level);

      return require(`./images/x${amount}-1.png`);
    },
    getChestLevel(level) {
      const chest = this.rewards[level - 1].chest;
      if (!chest || chest === null) return false;

      return chest.toString();
    },
    getMovie(level) {
      const cosmetic_id = this.rewards[level - 1].cosmetic_id;
      if (!cosmetic_id || cosmetic_id === null) return false;
      if (!webm.has(cosmetic_id)) return false;

      return require(`./images/${cosmetic_id}.webm`);
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
  left: 110%;
  top: -70px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 300px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: -1;
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
  right: 110%;
  top: -70px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 300px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: -1;
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
  top: -1em;

  width: 300px;
}

.lvl-wrapper img {
  height: 150px;

  cursor: pointer;
}

.lvl-wrapper img:hover {
  box-shadow: 0 0 30px 0 rgba(11, 134, 196, 0.3);
}

.lvl-locked {
  box-shadow: unset;
  filter: grayscale(100%);
}

.lvl-locked:hover {
  filter: grayscale(0%);
}
</style>
