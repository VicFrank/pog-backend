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
                <template v-if="cosmeticMovie(cosmetic.cosmetic_id)">
                  <div
                    class="cosmetic has-modal"
                    @click="$bvModal.show(`bp-modal-${cosmetic.cosmetic_id}`)"
                  >
                    <div class="cosmetic__picture">
                      <img
                        v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                        :alt="cosmetic.cosmetic_id"
                      />
                    </div>
                    <div class="cosmetic__descr">
                      <div class="cosmetic__name">
                        {{ cosmeticName(cosmetic.cosmetic_id) }}
                      </div>
                      <div class="cosmetic__price">
                        <span class="cosmetic-price"
                          >{{ cosmetic.cost }} Poggers</span
                        >
                      </div>
                    </div>
                  </div>
                  <b-modal
                    :id="`bp-modal-${cosmetic.cosmetic_id}`"
                    :title="cosmeticName(cosmetic.cosmetic_id)"
                    centered
                    hide-footer
                  >
                    <video width="360" height="360" autoplay>
                      <source
                        :src="cosmeticMovie(cosmetic.cosmetic_id)"
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </b-modal>
                </template>
                <template v-else>
                  <div class="cosmetic">
                    <div class="cosmetic__picture">
                      <img
                        v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)"
                        :alt="cosmetic.cosmetic_id"
                      />
                    </div>
                    <div class="cosmetic__descr">
                      <div class="cosmetic__name">
                        {{ cosmeticName(cosmetic.cosmetic_id) }}
                      </div>
                      <div class="cosmetic__price">
                        <span class="cosmetic-price"
                          >{{ cosmetic.cost }} Poggers</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
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
import filters from "./filters";
import CosmeticsFilter from "./CosmeticsFilter.vue";

export default {
  data: () => ({
    error: "",
    cosmetics: [],
    filteredCosmetics: [],
    activeFilters: new Set(),
    filters: [],
  }),

  components: {
    CosmeticsFilter,
  },

  created() {
    this.filters = filters;

    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        const purchaseableCosmetics = cosmetics.filter((cosmetic) => {
          return cosmetic.cost > 0;
        });
        this.cosmetics = purchaseableCosmetics;
        this.filteredCosmetics = purchaseableCosmetics;
      })
      .catch((err) => (this.error = err));
  },

  watch: {
    searchText: function() {
      this.updateFilteredCosmetics();
    },
  },

  methods: {
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
          this.filters = this.filters.map((filter) =>
            filter.name === "All" ? { ...filter, active: false } : filter
          );
        } else {
          this.activeFilters.delete(name);
        }
      }

      this.filters = this.filters.map((filter) =>
        filter.name === name ? { ...filter, active: !filter.active } : filter
      );

      // if there are no active filters, make "all active"
      if (this.hasNoFilters()) {
        this.filters = this.filters.map((filter) =>
          filter.name === "All" ? { ...filter, active: true } : filter
        );
      }

      this.updateFilteredCosmetics();
    },
    clearFilters() {
      this.activeFilters.clear();
      this.filters = this.filters.map((filter) => ({
        ...filter,
        active: false,
      }));
    },
    hasNoFilters() {
      return this.activeFilters.size === 0;
    },
    updateFilteredCosmetics() {
      this.filteredCosmetics = this.cosmetics.filter((cosmetic) => {
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
        if (this.activeFilters.has("Special FX")) {
          if (
            cosmetic_type === "Battlepass FX" ||
            cosmetic_type === "Companion FX"
          ) {
            return true;
          }
        }
        if (this.activeFilters.has("Misc")) {
          if (cosmetic_type === "Avatar" || cosmetic_type === "Border") {
            return true;
          }
        }
        return false;
      });
    },
  },
};
</script>

<style>
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
