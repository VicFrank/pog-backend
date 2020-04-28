<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Cosmetics</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="search-bar mb-3">
              <div class="search-input">
                <input type="text" name="search" placeholder="Search..." v-model="searchText" />
              </div>
            </div>

            <div class="cosmetic-bar">
              <div class="btns-bar">
                <cosmeticsFilter
                  v-for="filter in filters"
                  :key="filter.name"
                  v-on:toggle-filter="toggleFilter"
                  :filterName="filter.name"
                  :isLeft="filter.isLeft"
                  :isRight="filter.isRight"
                  :active="filter.active"
                />
              </div>
            </div>
            <div class="cosmetic-bar">
              <div class="btns-bar">
                <cosmeticsFilter
                  v-for="filter in rarityFilters"
                  :key="filter.name"
                  v-on:toggle-filter="toggleRarityFilter"
                  :filterName="filter.name"
                  :isLeft="filter.isLeft"
                  :isRight="filter.isRight"
                  :active="filter.active"
                />
              </div>
            </div>

            <b-alert v-model="showError" show variant="danger" dismissible>{{error}}</b-alert>

            <div class="cosmetics">
              <div
                class="cosmetics__item"
                v-for="[i, cosmetic] of filteredCosmetics.entries()"
                :key="
                  cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped + i
                "
              >
                <div class="cosmetic" @click="$bvModal.show(`modal-${i}`)">
                  <div class="cosmetic__picture">
                    <img
                      v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                      :alt="cosmetic.cosmetic_id"
                    />
                    <img
                      v-if="cosmetic.equipped"
                      src="./images/equipped.png"
                      class="equipped-overlay"
                      alt
                    />
                  </div>
                  <div class="cosmetic__descr">
                    <div class="cosmetic__name">{{ cosmeticName(cosmetic.cosmetic_id) }}</div>
                  </div>
                </div>
                <b-modal
                  :id="`modal-${i}`"
                  :ref="`modal-${i}`"
                  :title="cosmeticName(cosmetic.cosmetic_id)"
                  centered
                  hide-footer
                  @hide="onHide"
                >
                  <template v-if="cosmetic.cosmetic_type !== 'Chest'">
                    <div v-if="cosmeticMovie(cosmetic.cosmetic_id)">
                      <video width="100%" height="360" autoplay muted loop>
                        <source :src="cosmeticMovie(cosmetic.cosmetic_id)" type="video/webm" />Your browser does not support the video tag.
                      </video>
                    </div>
                    <div v-else class="text-center">
                      <img
                        v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                        :alt="cosmetic.cosmetic_id"
                      />
                    </div>
                    <div
                      v-if="illegalAccelerator(cosmetic)"
                      class="text-center"
                    >You can't use an accelerator lower than your current level.</div>
                    <div class="mt-4 d-flex justify-content-end">
                      <template v-if="equippable(cosmetic)">
                        <b-button class="mr-2" variant="secondary" @click="hideModal(i)">Cancel</b-button>
                        <b-button
                          v-if="!cosmetic.equipped"
                          class="mr-2"
                          variant="primary"
                          @click="equipCosmetic(cosmetic, true, i)"
                        >Equip</b-button>
                        <b-button
                          v-else
                          class="mr-2"
                          variant="primary"
                          @click="equipCosmetic(cosmetic, false, i)"
                        >Unequip</b-button>
                      </template>

                      <b-button
                        v-if="isUsable(cosmetic)"
                        class="mr-2"
                        variant="primary"
                        @click="consumeItem(cosmetic)"
                      >Use</b-button>
                    </div>
                  </template>
                  <template v-else>
                    <ChestOpener
                      :cosmetic="cosmetic"
                      v-on:cancel="hideModal(i)"
                      v-on:open="open()"
                      v-on:claim="claim()"
                    />
                  </template>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cosmeticsData from "./cosmeticNames";
import webm from "./webmList";
import CosmeticsFilter from "./CosmeticsFilter.vue";
import ChestOpener from "./ChestOpener.vue";
import filterCosmetics from "./cosmeticFilters";

export default {
  data: () => ({
    error: "",
    showError: false,
    cosmetics: [],
    filteredCosmetics: [],
    currentFilter: "All",
    searchText: "",
    needReload: false,
    filters: [
      {
        name: "Companions",
        active: false
      },
      {
        name: "Companions FX",
        active: false
      },
      {
        name: "Chests",
        active: false
      },
      {
        name: "Battle Pass",
        active: false
      },
      {
        name: "Announcer",
        active: false
      },
      {
        name: "Equipped",
        active: false
      },
      {
        name: "All",
        isRight: true,
        active: true
      }
    ],
    rarityFilters: [
      { name: "Common", active: false },
      { name: "Uncommon", active: false },
      { name: "Rare", active: false },
      { name: "Mythical", active: false },
      { name: "Legendary", active: false },
      { name: "Ancient", active: false },
      { name: "All", active: true, isRight: true }
    ],
    activeRarityFilters: new Set()
  }),

  components: {
    CosmeticsFilter,
    ChestOpener
  },

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    bpTier() {
      return this.$store.state.auth.bpTier;
    }
  },

  created() {
    this.getPlayerCosmetics();
  },

  watch: {
    searchText: function() {
      this.updateFilteredCosmetics();
    }
  },

  methods: {
    getPlayerCosmetics() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/cosmetics`)
        .then(res => res.json())
        .then(cosmetics => {
          const sortedCosmetics = cosmetics.sort((c1, c2) => {
            if (this.isConsumableOrChest(c1) && !this.isConsumableOrChest(c2)) {
              return -1;
            } else if (
              this.isConsumableOrChest(c2) &&
              !this.isConsumableOrChest(c1)
            ) {
              return 1;
            } else if (
              this.isConsumableOrChest(c1) &&
              this.isConsumableOrChest(c2)
            ) {
              return c1.cosmetic_id.localeCompare(c2.cosmetic_id);
            }
            const c1type = c1.cosmetic_type || "Companion";
            const c2type = c2.cosmetic_type || "Companion";
            return c1type.localeCompare(c2type);
          });
          this.cosmetics = sortedCosmetics;
          this.filteredCosmetics = sortedCosmetics;
        })
        .catch(err => {
          this.showError = true;
          this.error = err;
        });
    },
    isConsumableOrChest(cosmetic) {
      return (
        cosmetic.cosmetic_type === "Chest" ||
        cosmetic.cosmetic_type === "XP" ||
        cosmetic.cosmetic_type === "Chest XP" ||
        cosmetic.cosmetic_type === "BP Accelerator"
      );
    },
    isUsable(cosmetic) {
      console.log("Is Usable");
      if (this.illegalAccelerator(cosmetic)) return false;
      return (
        cosmetic.cosmetic_type === "XP" ||
        cosmetic.cosmetic_type === "Chest XP" ||
        cosmetic.cosmetic_type === "BP Accelerator"
      );
    },
    illegalAccelerator(cosmetic) {
      return cosmetic.cosmetic_id === "bpaccel1" && this.bpTier === 2;
    },
    hideModal(i) {
      this.$refs[`modal-${i}`][0].hide();
    },
    open() {
      this.needReload = true;
    },
    onHide() {
      if (this.needReload) {
        this.needReload = false;
        this.getPlayerCosmetics();
      }
    },
    claim() {
      this.needReload = false;
      this.getPlayerCosmetics();
    },
    equippable(cosmetic) {
      return !this.isConsumableOrChest(cosmetic);
    },
    cosmeticImageSrc(cosmeticID) {
      return require(`./images/${cosmeticID}.png`);
    },
    cosmeticMovie(cosmeticID) {
      if (!webm.has(cosmeticID)) return false;
      return require(`./images/${cosmeticID}.webm`);
    },
    cosmeticName(cosmeticID) {
      return cosmeticsData[cosmeticID];
    },
    toggleFilter(name) {
      this.filters = this.filters.map(filter => ({
        ...filter,
        active: filter.name === name
      }));

      this.currentFilter = name;

      this.updateFilteredCosmetics();
    },
    toggleRarityFilter(name, active) {
      if (name === "All") {
        this.activeRarityFilters.clear();
        this.rarityFilters = this.rarityFilters.map(filter => ({
          ...filter,
          active: false
        }));
      } else {
        if (active) {
          this.activeRarityFilters.add(name);
          // remove all from the filters if another is active
          this.rarityFilters = this.rarityFilters.map(filter =>
            filter.name === "All" ? { ...filter, active: false } : filter
          );
        } else {
          this.activeRarityFilters.delete(name);
        }
      }

      this.rarityFilters = this.rarityFilters.map(filter =>
        filter.name === name ? { ...filter, active: !filter.active } : filter
      );

      // if there are no active filters, make "all active"
      if (this.activeRarityFilters.size === 0) {
        this.rarityFilters = this.rarityFilters.map(filter =>
          filter.name === "All" ? { ...filter, active: true } : filter
        );
      }

      this.updateFilteredCosmetics();
    },
    updateFilteredCosmetics() {
      this.filteredCosmetics = filterCosmetics(
        this.cosmetics,
        this.currentFilter,
        this.activeRarityFilters,
        this.searchText
      );
    },
    equipCosmetic(cosmetic, equip, i) {
      const cosmeticID = cosmetic.cosmetic_id;
      const isCompanion = cosmetic.companion_level != undefined;

      if (isCompanion) {
        fetch(`/api/players/${this.steamID}/equipped_companion`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            companionID: cosmetic.companion_id
          })
        })
          .then(res => {
            if (!res.ok) throw Error(res.statusText);
            return res;
          })
          .then(res => res.json())
          .then(() => {
            this.getPlayerCosmetics();
            this.hideModal(i);
          })
          .catch(err => {
            this.error = err;
            this.showError = true;
          });
      } else {
        fetch(
          `/api/players/${this.steamID}/cosmetics/${cosmeticID}/equip?equip=${equip}`,
          {
            method: "post"
          }
        )
          .then(res => {
            if (!res.ok) throw Error(res.statusText);
            return res;
          })
          .then(res => res.json())
          .then(() => {
            this.getPlayerCosmetics();
            this.hideModal(i);
          })
          .catch(err => {
            this.error = err;
            this.showError = true;
          });
      }
    },
    consumeItem(cosmetic) {
      const cosmeticID = cosmetic.cosmetic_id;

      fetch(`/api/players/${this.steamID}/use_item/${cosmeticID}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.error = res.error;
            this.showError = true;
          } else {
            this.success = true;
            this.$store.dispatch("refreshBattlePass");
            this.getPlayerCosmetics();
          }
        })
        .catch(err => {
          this.error = err;
          this.showError = true;
        });
    }
  }
};
</script>

<style>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 50px;
}

.equipped-overlay {
  position: absolute !important;
  bottom: 0;
  top: 0;
  left: 0;
  width: 100%;
}

.search-input {
  position: relative;
  height: 37px;
}

.search-input input {
  outline: transparent;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 8px 15px 9px 42px;
  border: 1px solid #0b86c4;
  border-radius: 18px;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 15px;
  line-height: normal;
  color: #fff;
  transition: 0.2s ease;
}

.search-input input::-webkit-input-placeholder {
  font-size: 15px;
  white-space: normal;
}

.search-input input::-moz-placeholder {
  font-size: 15px;
  white-space: normal;
}

.search-input input:-ms-input-placeholder {
  font-size: 15px;
  white-space: normal;
}

.search-input input:-moz-placeholder {
  font-size: 15px;
  white-space: normal;
}

.search-input input:focus {
  border: 1px solid #53c0ff;
}

.search-input:before {
  content: "";
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 15px;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url("./images/icon_search.svg");
}

.cosmetic-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0px 50px;
}

.btns-bar {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1em;
}

.btns-bar label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.44px;
  padding: 18px 18px;
  text-align: center;
  font-family: "Radiance-Semibold";
  color: #fcfcfc;
}

.active-filter {
  background-color: #0b86c4;
  border-color: #0b86c4;
  color: #fff;
}

.active-filter:before {
  opacity: 1;
  visibility: visible;
}

.active-filter:hover {
  background-color: #212e3a;
  color: #0b86c4;
}

.btns-bar__btn {
  margin: 0;
  position: relative;
  height: 100%;
  display: flex;
  margin-right: 1px;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #0b86c4;
  font-size: 15px;
  line-height: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: 0.2s ease;
}

.btns-bar__btn_left {
  border-radius: 18px 0 0 18px;
  border-left: 1px solid #0b86c4;
}

.btns-bar__btn_right {
  margin: 0;
  border-radius: 0 18px 18px 0;
}

.btns-bar__btn_right:before {
  display: none;
}

.btns-bar__btn:hover {
  background-color: rgba(40, 152, 243, 0.349);
}

.cosmetics {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.cosmetics__item {
  margin-top: 20px;
  width: 33.3%;
}

.cosmetics__item a {
  text-decoration: none;
}

.cosmetic {
  display: block;
  position: relative;
  padding: 20px 0 5px;
  text-align: center;
  text-decoration: none;
  transition: 0.25s ease-in-out;
  z-index: 1;

  cursor: pointer;
}

.cosmetic:hover {
  background-color: rgba(0, 0, 0, 0.15);
}

.cosmetic:hover .cosmetic__price {
  transition: 0.25s ease-in-out;

  box-shadow: 0 0 35px 0 #457296;
}

.cosmetic:hover .cosmetic__descr:after {
  border-bottom-color: #0b86c4;
}

.cosmetic__price {
  padding: 10px 20px;
  font-size: 18px;
  margin: 20px 0 35px 0;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.45px;
  color: #0b86c4;
  font-family: "Radiance-Semibold";
  border-radius: 15px;
  background-color: #212e3a;
}

.cosmetic__picture {
  width: 90%;
  margin: auto;
}

.cosmetic__picture img {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: auto;
}

.cosmetic__descr {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 3;
}

.cosmetic__descr:before {
  z-index: -1;
  bottom: 0;
  width: 125px;
  height: 30px;
  background-color: #ffde46;
  filter: blur(28px);
  opacity: 0;
  visibility: hidden;
  transform: translateZ(0);
}

.cosmetic__name {
  width: 100%;
  min-height: 36px;
  padding: 0 1em;
  position: relative;
  text-overflow: ellipsis;
  transition: 0.25s ease-in-out;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  font-family: "Radiance-Semibold";
}

.cosmetic__descr:after {
  width: 80%;
  border-bottom: 2px solid #193544;
}

.cosmetic__descr:after,
.cosmetic__descr:before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  transition: 0.25s ease-in-out;
}

.cosmetic__descr:before {
  z-index: -1;
  bottom: 0;
  width: 125px;
  height: 30px;
  background-color: #ffde46;
  filter: blur(28px);
  opacity: 0;
  visibility: hidden;
  transform: translateZ(0);
}

.cosmetics__item {
  width: 19%;
}

.price.price-USD:before {
  content: "$";
}

@media (max-width: 575.98px) {
  .cosmetics__item {
    width: 100% !important;
  }

  .cosmetics,
  .search-bar,
  .cosmetic-bar {
    padding: 0;
  }

  .btns-bar__btn_left {
    border-radius: 0;
    border-left: 1px solid #0b86c4;
  }

  .btns-bar__btn_right {
    margin: 0;
    border-radius: 0;
  }

  .btns-bar__btn {
    width: 100%;
  }
}

@media (max-width: 767.98px) {
  .cosmetics__item {
    width: 100% !important;
  }

  .btns-bar {
    flex-wrap: wrap;
  }
}

@media (max-width: 1199.98px) {
  .cosmetics__item {
    width: 20%;
  }
}
</style>
