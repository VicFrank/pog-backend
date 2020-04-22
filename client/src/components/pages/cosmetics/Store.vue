<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Store</h1>
      <div class="container">
        <h2 class="text-center blue">Sales</h2>
        <!-- <p class="text-center">1 day 2 hours 43mins</p> -->
        <div class="row">
          <div class="sale">
            <img src="./images/companion3.png" alt />
            <div class="overlay">
              <h3>Doomling</h3>
              <p>100 Poggers</p>
            </div>
          </div>
          <div class="sale">
            <img src="./images/companion4.png" alt />
            <div class="overlay">
              <h3>Huntling</h3>
              <p>100 Poggers</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <b-alert v-if="error" show variant="danger" dismissible>{{error}}</b-alert>
        <b-alert v-if="success" show variant="success" dismissible>Purchase Complete!</b-alert>
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

            <div class="cosmetics">
              <div
                class="cosmetics__item"
                v-for="cosmetic in filteredCosmetics"
                :key="cosmetic.cosmetic_id"
              >
                <div
                  class="cosmetic shop-item"
                  @click="$bvModal.show(`bp-modal-${cosmetic.cosmetic_id}`)"
                >
                  <div class="cosmetic__picture">
                    <img
                      v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                      :alt="cosmetic.cosmetic_id"
                    />
                  </div>
                  <div class="cosmetic__descr">
                    <div class="cosmetic__name">{{ cosmeticName(cosmetic.cosmetic_id) }}</div>
                    <div class="cosmetic__price">
                      <span class="cosmetic-price">{{ cosmetic.cost }} Poggers</span>
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
                  <p class="text-center h3">{{cosmeticName(cosmetic.cosmetic_id)}}</p>
                  <p class="text-center">{{ cosmetic.cost }} Poggers</p>
                  <template v-if="cosmeticMovie(cosmetic.cosmetic_id)">
                    <video width="100%" height="360" autoplay muted>
                      <source :src="cosmeticMovie(cosmetic.cosmetic_id)" type="video/webm" />Your browser does not support the video tag.
                    </video>
                  </template>
                  <template v-else>
                    <div>
                      <img
                        class="preview-image"
                        v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                        :alt="cosmetic.cosmetic_id"
                      />
                    </div>
                  </template>
                  <div v-if="cosmetic.cosmetic_type === 'Chest'" class="mt-3">
                    This chest contains the following prizes:
                    <ul class="mt-1">
                      <li
                        v-for="reward in chestRewards[cosmetic.cosmetic_id]"
                        :key="reward"
                      >{{reward}}</li>
                    </ul>
                  </div>
                  <div v-if="loggedIn" class="mt-4 d-flex justify-content-end">
                    <b-button
                      class="mr-2"
                      variant="secondary"
                      @click="hideModal(cosmetic.cosmetic_id)"
                    >Cancel</b-button>
                    <b-button
                      :disabled="poggers < cosmetic.cost"
                      class="mr-2"
                      variant="primary"
                      @click="buyItem(cosmetic)"
                    >Buy</b-button>
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
  </div>
</template>

<script>
import cosmeticsData from "./cosmeticNames";
import webm from "./webmList";
import CosmeticsFilter from "./CosmeticsFilter.vue";
import LoginButton from "../login/LoginButton";
import chestRewards from "./chests";

export default {
  data: () => ({
    error: "",
    success: false,
    loading: false,
    cosmetics: [],
    filteredCosmetics: [],
    activeFilters: new Set(),
    chestRewards,
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
        name: "All",
        isRight: true,
        active: true
      }
    ]
  }),

  components: {
    CosmeticsFilter,
    LoginButton
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
    }
  },

  created() {
    this.chestRewards = chestRewards;

    fetch(`/api/cosmetics`)
      .then(res => res.json())
      .then(cosmetics => {
        const purchaseableCosmetics = cosmetics.filter(cosmetic => {
          return cosmetic.cost > 0;
        });
        this.cosmetics = purchaseableCosmetics;
        this.filteredCosmetics = purchaseableCosmetics;
      })
      .catch(err => (this.error = err));
  },

  watch: {
    searchText: function() {
      this.updateFilteredCosmetics();
    }
  },

  methods: {
    hideModal(cosmeticID) {
      this.$refs[`bp-modal-${cosmeticID}`][0].hide();
    },
    buyItem(cosmetic) {
      this.hideModal(cosmetic_id);
      const { cosmetic_id, cosmetic_type, cost } = cosmetic;

      // We can't afford this item
      if (this.poggers < cost) {
        return;
      }

      let transaction;

      if (cosmetic_type === "Companion") {
        transaction = {
          itemTransaction: {
            companions: [
              {
                name: cosmetic_id,
                effect: "-1",
                level: "1",
                amount: "1"
              }
            ],
            poggers: -cost
          }
        };
      } else {
        let items = {};
        items[cosmetic_id] = "1";
        transaction = {
          itemTransaction: {
            items,
            poggers: -cost
          }
        };
      }

      this.selected = [];
      this.loading = true;

      fetch(`/api/players/${this.steamID}/transaction`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
      })
        .then(res => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then(res => res.json())
        .then(() => {
          this.loading = false;
          document.documentElement.scrollTop = 0;
          this.success = true;
          this.$store.dispatch("refreshPoggers");
        })
        .catch(err => {
          this.error = err;
          this.loading = false;
          document.documentElement.scrollTop = 0;
        });
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
    toggleFilter(name, active) {
      if (name === "All") {
        this.clearFilters();
      } else {
        if (active) {
          this.activeFilters.add(name);
          // remove all from the filters if another is active
          this.filters = this.filters.map(filter =>
            filter.name === "All" ? { ...filter, active: false } : filter
          );
        } else {
          this.activeFilters.delete(name);
        }
      }

      this.filters = this.filters.map(filter =>
        filter.name === name ? { ...filter, active: !filter.active } : filter
      );

      // if there are no active filters, make "all active"
      if (this.hasNoFilters()) {
        this.filters = this.filters.map(filter =>
          filter.name === "All" ? { ...filter, active: true } : filter
        );
      }

      this.updateFilteredCosmetics();
    },
    clearFilters() {
      this.activeFilters.clear();
      this.filters = this.filters.map(filter => ({
        ...filter,
        active: false
      }));
    },
    hasNoFilters() {
      return this.activeFilters.size === 0;
    },
    updateFilteredCosmetics() {
      console.log(this.activeFilters.has("Battle Pass"));
      this.filteredCosmetics = this.cosmetics.filter(cosmetic => {
        // Type Filter
        const { cosmetic_type, equip_group } = cosmetic;
        if (this.hasNoFilters()) {
          return true;
        }
        if (this.activeFilters.has("Companions")) {
          if (equip_group === "companion") {
            return true;
          }
        }
        if (this.activeFilters.has("Companions FX")) {
          if (equip_group === "companion_fx") {
            return true;
          }
        }
        if (this.activeFilters.has("Chests")) {
          if (cosmetic_type === "Chest") {
            return true;
          }
        }
        if (this.activeFilters.has("Battle Pass")) {
          if (
            cosmetic_type === "Battlepass FX" ||
            cosmetic_type === "Avatar" ||
            cosmetic_type === "Border"
          ) {
            return true;
          }
        }
        if (this.activeFilters.has("Announcer")) {
          if (equip_group === "announcer") {
            return true;
          }
        }
        return false;
      });
    }
  }
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
