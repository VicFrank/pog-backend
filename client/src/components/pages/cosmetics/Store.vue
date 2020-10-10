<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title" v-t="'store.page_title'"></h1>
      <div class="container">
        <h2 class="text-center blue" v-t="'store.sales'"></h2>
        <!-- <p class="text-center">1 day 2 hours 43mins</p> -->
        <div class="row">
          <div class="sale">
            <router-link to="/subscriptions">
              <img
                src="./images/Battle_Pass_Icons_tickets.png"
                alt="Battle Pass Shop"
              />
            </router-link>
            <div class="overlay">
              <h3 v-t="'store.buy_bp'"></h3>
            </div>
          </div>
          <div class="sale">
            <img
              src="./images/mifune_ad.png"
              alt="Mifune"
              @click="$bvModal.show(`bp-modal-announcer2`)"
            />
            <!-- <img
              src="./images/discount.png"
              @click="$bvModal.show(`bp-modal-doomling`)"
              class="sales-overlay"
              alt
            />-->
            <div class="overlay">
              <h3>Mifune Announcer Pack</h3>
              <p>
                <img
                  class="pogcoin"
                  src="./images/pogcoin_gold.png"
                  alt="Pog Coin"
                />
                100 POGGERS
              </p>
            </div>
          </div>
          <div class="sale">
            <router-link to="/poggers">
              <img src="./images/poggers_shop.png" alt="Poggers Shop" />
            </router-link>
            <div class="overlay">
              <h3 v-t="'store.buy_poggers'"></h3>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <b-alert v-model="showError" variant="danger" dismissible>
          {{ error }}
        </b-alert>
        <div class="row">
          <div class="col-xl-12">
            <div class="cosmetic-bar">
              <div class="btns-bar">
                <CosmeticsFilter
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

            <div class="cosmetics mb-3">
              <div
                class="cosmetics__item"
                v-for="cosmetic in filteredCosmetics"
                :key="cosmetic.cosmetic_id"
              >
                <div
                  class="cosmetic shop-item"
                  @click="$bvModal.show(`bp-modal-${cosmetic.cosmetic_id}`)"
                >
                  <div>
                    <img
                      v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                      :alt="cosmetic.cosmetic_id"
                      class="preview-image"
                    />
                  </div>
                  <div class="cosmetic__descr">
                    <div class="cosmetic__name mb-1">
                      {{ $t(`cosmetics.${cosmetic.cosmetic_id}`) }}
                    </div>
                    <div class="text-muted">
                      {{ $t(`cosmetics.${cosmetic.cosmetic_type}`) }}
                    </div>
                    <div class="cosmetic__price">
                      <span class="cosmetic-price">
                        <template v-if="cosmetic.cost > 0">
                          <img
                            class="pogcoin"
                            src="./images/pogcoin_gold.png"
                            alt="Pog Coin"
                          />
                          {{ cosmetic.cost }} POGGERS
                        </template>
                        <template v-else>${{ getPrice(cosmetic) }}</template>
                      </span>
                    </div>
                  </div>
                </div>
                <b-modal
                  :id="`bp-modal-${cosmetic.cosmetic_id}`"
                  :ref="`bp-modal-${cosmetic.cosmetic_id}`"
                  centered
                  hide-header
                  hide-footer
                >
                  <p class="text-center h4">
                    {{ $t(`cosmetics.${cosmetic.cosmetic_id}`) }}
                    <router-link
                      v-if="cosmetic.cosmetic_type === 'Chest'"
                      to="chest_rates"
                      target="_blank"
                    >
                      <i class="fas fa-info-circle info-icon"></i>
                    </router-link>
                  </p>
                  <div class="text-center text-muted mb-3">
                    {{ cosmetic.cosmetic_type }}
                  </div>
                  <p class="text-center">
                    <template v-if="cosmetic.cost > 0">
                      <img
                        class="pogcoin"
                        src="./images/pogcoin_gold.png"
                        alt="Pog Coin"
                      />
                      {{ cosmetic.cost }} POGGERS
                    </template>
                    <template v-else>${{ getPrice(cosmetic) }}</template>
                  </p>
                  <template v-if="cosmeticMovie(cosmetic.cosmetic_id)">
                    <video width="100%" height="360" autoplay muted loop>
                      <source
                        :src="cosmeticMovie(cosmetic.cosmetic_id)"
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </template>
                  <template v-else>
                    <div>
                      <b-img-lazy
                        class="preview-image"
                        v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                        :alt="cosmetic.cosmetic_id"
                      />
                    </div>
                  </template>
                  <CosmeticDescription :cosmetic="cosmetic" />
                  <div v-if="alreadyOwn(cosmetic)" class="text-center mt-3">
                    {{ $t("store.already_own") }}
                  </div>
                  <div v-if="loggedIn" class="mt-4 d-flex justify-content-end">
                    <b-button
                      class="mr-2"
                      variant="secondary"
                      @click="hideModal(cosmetic.cosmetic_id)"
                      >{{ $t("armory.cancel") }}</b-button
                    >
                    <b-button
                      v-if="poggers < cosmetic.cost"
                      class="mr-2"
                      variant="primary"
                      to="/poggers"
                      >{{ $t("store.get_more_poggers") }}</b-button
                    >
                    <b-button
                      v-if="cosmetic.cosmetic_type === 'XP'"
                      class="mr-2"
                      variant="primary"
                      :to="getXPShopLink(cosmetic)"
                      >{{ $t("store.buy") }}</b-button
                    >
                    <b-button
                      v-else
                      :disabled="
                        poggers < cosmetic.cost || alreadyOwn(cosmetic)
                      "
                      class="mr-2"
                      variant="primary"
                      v-b-modal.modal-confirm-purchase
                      @click="currentCosmetic = cosmetic"
                      >{{ $t("store.buy") }}</b-button
                    >
                  </div>
                  <div v-else class="mt-4 d-flex justify-content-center">
                    <LoginButton />
                  </div>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmPurchase
      :cosmetic="currentCosmetic"
      v-on:buy="buyItem"
      v-on:cancel="hideModal"
    />
  </div>
</template>

<script>
import webm from "./webmList";
import CosmeticsFilter from "./CosmeticsFilter.vue";
import ConfirmPurchase from "./ConfirmPurchase.vue";
import CosmeticDescription from "./components/CosmeticDescription.vue";
import LoginButton from "../login/LoginButton";
import filterCosmetics from "./cosmeticFilters";

export default {
  data: () => ({
    error: "",
    showError: false,
    success: false,
    loading: false,
    currentCosmetic: {},
    cosmetics: [],
    filteredCosmetics: [],
    currentFilter: "All",
    filters: [
      {
        name: "Companions",
        active: false,
      },
      {
        name: "Companions FX",
        active: false,
      },
      {
        name: "Chests",
        active: false,
      },
      {
        name: "XP",
        active: false,
      },
      {
        name: "All",
        isRight: true,
        active: true,
      },
    ],
    rarityFilters: [
      { name: "Common", active: false },
      { name: "Uncommon", active: false },
      { name: "Rare", active: false },
      { name: "Mythical", active: false },
      { name: "Legendary", active: false },
      // { name: "Ancient", active: false },
      { name: "All", active: true, isRight: true },
    ],
    activeRarityFilters: new Set(),
    ownedCosmetics: [],
  }),

  components: {
    CosmeticsFilter,
    LoginButton,
    ConfirmPurchase,
    CosmeticDescription,
  },

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    poggers() {
      return this.$store.state.auth.poggers;
    },
  },

  created() {
    if (this.loggedIn && this.steamID) {
      fetch(`/api/players/${this.steamID}/cosmetics`)
        .then((res) => res.json())
        .then((cosmetics) => {
          this.ownedCosmetics = cosmetics;
        })
        .catch((err) => {
          this.showError = true;
          this.error = err;
        });
    }

    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        const purchaseableCosmetics = cosmetics
          .filter((cosmetic) => {
            return cosmetic.cost > 0 || cosmetic.cosmetic_type === "XP";
          })
          .sort((c1, c2) => {
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
              // I didn't really think about how this works, I just kind of
              // hoped that it would and it did
              const c1Chest = c1.cosmetic_type == "Chest" ? 1 : -1;
              const c2Chest = c2.cosmetic_type == "Chest" ? 1 : -1;
              if (c1Chest != c2Chest) {
                return c2Chest - c1Chest;
              }
              return c1.cosmetic_id.localeCompare(c2.cosmetic_id);
            }
            const c1type = c1.cosmetic_type || "Companion";
            const c2type = c2.cosmetic_type || "Companion";
            if (c1type.localeCompare(c2type) === 0) {
              return c1.cost - c2.cost;
            }
            return c1type.localeCompare(c2type);
          });

        this.cosmetics = purchaseableCosmetics;
        this.filteredCosmetics = purchaseableCosmetics;
      })
      .catch((err) => {
        this.error = err;
        this.showError = true;
      });
  },

  watch: {
    searchText: function () {
      this.updateFilteredCosmetics();
    },
  },

  methods: {
    hideModal(cosmeticID) {
      this.$refs[`bp-modal-${cosmeticID}`][0].hide();
    },
    isConsumableOrChest(cosmetic) {
      return (
        cosmetic.cosmetic_type === "Chest" ||
        cosmetic.cosmetic_type === "XP" ||
        cosmetic.cosmetic_type === "Chest XP" ||
        cosmetic.cosmetic_type === "BP Accelerator"
      );
    },
    getXPShopLink(cosmetic) {
      return `/checkout/${cosmetic.cosmetic_id}`;
    },
    buyItem(cosmetic) {
      const { cosmetic_id, cost } = cosmetic;
      this.hideModal(cosmetic_id);

      // We can't afford this item
      if (this.poggers < cost) {
        return;
      }

      this.selected = [];
      this.loading = true;

      fetch(`/api/players/${this.steamID}/buy_item/${cosmetic_id}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          document.documentElement.scrollTop = 0;
          if (res.error) {
            this.error = res.error;
            this.showError = true;
          } else {
            this.success = true;
            this.$store.dispatch("refreshPoggers");
          }
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
          this.showError = true;
          document.documentElement.scrollTop = 0;
        });
    },
    getPrice(cosmetic) {
      const { cosmetic_id } = cosmetic;
      switch (cosmetic_id) {
        case "xp_1":
          return 5;
        case "xp_2":
          return 10;
        case "xp_3":
          return 20;
        case "xp_4":
          return 50;
        case "xp_5":
          return 100;
      }
    },
    cosmeticImageSrc(cosmeticID) {
      return require(`./images/${cosmeticID}.png`);
    },
    cosmeticMovie(cosmeticID) {
      if (!webm.has(cosmeticID)) return false;
      return require(`./images/${cosmeticID}.webm`);
    },
    alreadyOwn(cosmetic) {
      const { cosmetic_type, cosmetic_id } = cosmetic;
      const canBuyMultiple =
        cosmetic_type == "BP Accelerator" ||
        cosmetic_type == "Chest" ||
        cosmetic_type == "XP";
      if (canBuyMultiple) return false;
      return this.ownedCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_id === cosmetic_id
      );
    },
    toggleFilter(name) {
      this.filters = this.filters.map((filter) => ({
        ...filter,
        active: filter.name === name,
      }));

      this.currentFilter = name;

      this.updateFilteredCosmetics();
    },
    toggleRarityFilter(name, active) {
      if (name === "All") {
        this.activeRarityFilters.clear();
        this.rarityFilters = this.rarityFilters.map((filter) => ({
          ...filter,
          active: false,
        }));
      } else {
        if (active) {
          this.activeRarityFilters.add(name);
          // remove all from the filters if another is active
          this.rarityFilters = this.rarityFilters.map((filter) =>
            filter.name === "All" ? { ...filter, active: false } : filter
          );
        } else {
          this.activeRarityFilters.delete(name);
        }
      }

      this.rarityFilters = this.rarityFilters.map((filter) =>
        filter.name === name ? { ...filter, active: !filter.active } : filter
      );

      // if there are no active filters, make "all active"
      if (this.activeRarityFilters.size === 0) {
        this.rarityFilters = this.rarityFilters.map((filter) =>
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
  },
};
</script>

<style>
.shop-item {
  cursor: pointer;
}

.preview-image {
  width: 200px;
  height: 200px;
  display: block;
  margin: auto;
}

.featured {
  position: relative;
  /* margin-top: 50px; */
  text-align: center;
  margin-bottom: 120px;
  box-shadow: 0 0 15px 0 #457296;
  width: 200px;
}

.sale {
  position: relative;
}

.featured h3,
.sale h3 {
  font-size: 20px;
  font-family: "Radiance-Semibold";
  line-height: 1.2;
  letter-spacing: 0.23px;
  text-align: center;
  color: #fcfcfc;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.featured p,
.sale p {
  font-size: 18px;
  font-family: "Radiance-Semibold";
  line-height: 1;
  letter-spacing: 0.45px;
  text-align: center;
  color: #0b86c4;
}

.featured img,
.sale img {
  position: relative;
  transition: 0.25s ease-in-out;
  width: 100%;

  cursor: pointer;
}

.sales-overlay {
  position: absolute !important;
  bottom: 0;
  top: 0;
  left: 0;
  width: 100%;
}

.overlay {
  height: 60px;
  opacity: 0.8;
  padding: 0.2em 1em 1em;
  background-color: #000000;
}

.sale {
  text-align: center;
  margin: 0 auto 40px;
  box-shadow: 0 0 15px 0 #457296;

  width: 300px;
}
</style>
