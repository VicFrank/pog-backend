<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Battle Pass</h1>
      <ul class="battlepass-timeline">
        <li v-for="i in rewards.length" :key="i">
          <div
            v-bind:class="{
              'direction-r': isEven(i),
              'direction-l': !isEven(i),
            }"
          >
            <span>Level {{ i }}</span>
            <div
              v-bind:class="{ 'lvl-wrapper': true, 'lvl-locked': i > bpLevel }"
            >
              <img
                v-if="getItemImage(i)"
                :src="getItemImage(i)"
                :alt="getRewardItem(i)"
                @click="$bvModal.show(`bp-modal-${i}`)"
              />
              <img
                v-if="getChestAmount(i) > 0"
                v-bind:src="getChestImage(i)"
                alt="Chest Image"
                @click="$bvModal.show(getChestLevel(i))"
              />

              <b-modal
                :id="`bp-modal-${i}`"
                :title="getItemName(i)"
                centered
                hide-footer
              >
                <video v-if="getMovie(i)" width="100%" height="360" autoplay>
                  <source :src="getMovie(i)" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </b-modal>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <b-modal :id="'1'" title="Common Chest" centered hide-footer>
      <h5>Gain a free Common Chest! It contains the following prizes:</h5>
      <ul>
        <li>[Guaranteed] A random Common item!</li>
        <li>[Guaranteed] Up to 125 Poggers!</li>
        <li>[Chance] A bonus Uncommon item</li>
        <li>[Small Chance] A bonus Rare item</li>
      </ul>
    </b-modal>
    <b-modal :id="'2'" title="Uncommon Chest" centered hide-footer>
      <h5>Gain a free Uncommon Chest! It contains the following prizes:</h5>
      <ul>
        <li>[Guaranteed] A random Uncommon item!</li>
        <li>[Guaranteed] Up to 250 Poggers!</li>
        <li>[High chance] A bonus random Common item</li>
        <li>[Chance] A bonus Rare item</li>
        <li>[Small Chance] A bonus Mythical item</li>
      </ul>
    </b-modal>
    <b-modal :id="'3'" title="Rare Chest" centered hide-footer>
      <h5>Gain a free Rare Chest! It contains the following prizes:</h5>
      <ul>
        <li>[Guaranteed] A random Mythical item!</li>
        <li>[Guaranteed] Up to 450 Poggers!</li>
        <li>[High chance] A bonus random Common item</li>
        <li>[High chance] A bonus random Uncommon item</li>
        <li>[Chance] A bonus Mythical item</li>
        <li>[Very Small Chance] A bonus legendary item!</li>
      </ul>
    </b-modal>
    <b-modal :id="'4'" title="Mythical Chest" centered hide-footer>
      <h5>Gain a free Mythical Chest! It contains the following prizes:</h5>
      <ul>
        <li>[Guaranteed] A random Mythical item!</li>
        <li>[Guaranteed] Up to 1100 Poggers!</li>
        <li>[Chance] Up to 10,000 bonus battle pass exp!</li>
        <li>[Guaranteed] A bonus Common item</li>
        <li>[High chance] A bonus random Uncommon item</li>
        <li>[High chance] A bonus random Rare item</li>
        <li>[Chance] A bonus Mythical item</li>
        <li>[Small Chance] A bonus Legendary item</li>
        <li>[Very Small Chance] The unique Overgrown Emblem!</li>
      </ul>
    </b-modal>
    <b-modal :id="'5'" title="Legendary Chest" centered hide-footer>
      <h5>Gain a free Legendary Chest! It contains the following prizes:</h5>
      <ul>
        <li>[Guaranteed] A random Legendary item!</li>
        <li>[Guaranteed] Up to 2000 Poggers!</li>
        <li>[Guaranteed] A bonus Common item</li>
        <li>[Guaranteed] A bonus Uncommon item</li>
        <li>[Guaranteed] A bonus Rare item</li>
        <li>[Chance] A bonus Mythical item</li>
      </ul>
    </b-modal>
  </div>
</template>

<script>
import names from "./cosmeticNames";

export default {
  data: () => ({
    error: "",
    rewards: [],
    noWebm: new Set([
      "badge1",
      "badge2",
      "badge3",
      "badge4",
      "badge5",
      "baloon1",
      "baloon2",
      "baloon3",
      "baloon4",
      "baloon5",
      "baloon6",
      "baloon7",
      "baloon8",
      "baloon9",
      "baloon10",
      "baloon11",
      "border1",
      "border2",
      "border3",
      "border4",
      "border5",
      "bpaccel1",
      "bpaccel2",
      "deny1",
      "deny2",
      "deny3",
      "deny4",
      "deny5",
      "highfive1",
      "highfive2",
      "highfive3",
      "highfive4",
      "highfive5",
      "picking1",
      "picking2",
      "reroll",
      "teleport1",
      "teleport2",
      "teleport3",
    ]),
  }),

  created() {
    fetch(`/api/cosmetics/battle_pass`)
      .then((res) => res.json())
      .then((rewards) => {
        this.rewards = rewards;
      })
      .catch((err) => (this.error = err));
  },

  computed: {
    bpLevel() {
      return this.$store.getters.bpLevel;
    },
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
    getChestLevel(level) {
      const chest = this.rewards[level - 1].chest;
      if (!chest || chest === null) return false;

      return chest.toString();
    },
    getMovie(level) {
      const cosmetic_id = this.rewards[level - 1].cosmetic_id;
      if (!cosmetic_id || cosmetic_id === null) return false;
      if (this.noWebm.has(cosmetic_id)) return false;

      return require(`./images/${cosmetic_id}.webm`);
    },
  },
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
  box-shadow: 0 0 30px 0 rgba(11, 134, 196, 0.3);

  cursor: pointer;
}

.lvl-locked {
  box-shadow: unset;
  filter: grayscale(100%);
}
</style>
