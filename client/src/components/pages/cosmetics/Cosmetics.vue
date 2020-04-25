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

            <div class="cosmetics">
              <div
                class="cosmetics__item"
                v-for="cosmetic in filteredCosmetics"
                :key="
                  cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped
                "
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
                      <div class="cosmetic__name">{{ cosmeticName(cosmetic.cosmetic_id) }}</div>
                    </div>
                  </div>
                  <b-modal
                    :id="`bp-modal-${cosmetic.cosmetic_id}`"
                    :title="cosmeticName(cosmetic.cosmetic_id)"
                    centered
                    hide-footer
                  >
                    <video width="360" height="360" autoplay muted loop>
                      <source :src="cosmeticMovie(cosmetic.cosmetic_id)" type="video/webm" />Your browser does not support the video tag.
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
                      <div class="cosmetic__name">{{ cosmeticName(cosmetic.cosmetic_id) }}</div>
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
import CosmeticsFilter from "./CosmeticsFilter.vue";

export default {
  data: () => ({
    error: "",
    cosmetics: [],
    filteredCosmetics: [],
    currentFilter: "All",
    searchText: "",
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
      { name: "Legendary", active: false },
      { name: "Mythical", active: false },
      { name: "Ancient", active: false },
      { name: "All", active: true, isRight: true }
    ],
    activeRarityFilters: new Set()
  }),

  components: {
    CosmeticsFilter
  },

  created() {
    fetch(`/api/players/${this.$store.state.auth.userSteamID}/cosmetics`)
      .then(res => res.json())
      .then(cosmetics => {
        this.cosmetics = cosmetics;
        this.filteredCosmetics = cosmetics;
      })
      .catch(err => (this.error = err));
  },

  watch: {
    searchText: function() {
      this.updateFilteredCosmetics();
    }
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
      this.filteredCosmetics = this.cosmetics
        .filter(cosmetic => {
          // Type Filter
          if (this.currentFilter === "All") {
            return true;
          }

          const { cosmetic_type, equip_group, equipped } = cosmetic;
          if (this.currentFilter === "Companions") {
            if (equip_group === "companion") {
              return true;
            }
          }
          if (this.currentFilter === "Companions FX") {
            if (equip_group === "companion_fx") {
              return true;
            }
          }
          if (this.currentFilter === "Chests") {
            if (cosmetic_type === "Chest") {
              return true;
            }
          }
          if (this.currentFilter === "Battle Pass") {
            if (
              cosmetic_type === "Battlepass FX" ||
              cosmetic_type === "Avatar" ||
              cosmetic_type === "Border"
            ) {
              return true;
            }
          }
          if (this.currentFilter === "Announcer") {
            if (equip_group === "announcer") {
              return true;
            }
          }
          if (this.currentFilter === "Equipped") {
            return equipped;
          }
          return false;
        })
        .filter(cosmetic => {
          // Rarity Filter
          if (this.activeRarityFilters.size > 0) {
            return this.activeRarityFilters.has(cosmetic.rarity);
          }
          return true;
        })
        .filter(cosmetic => {
          // Text Search Filter
          if (!this.searchText) {
            return true;
          }
          const { cosmetic_id } = cosmetic;
          const name = this.cosmeticName(cosmetic_id).toLowerCase();
          const search = this.searchText.toLowerCase();
          if (
            search === "" ||
            name.includes(search) ||
            cosmetic_id.includes(search)
          ) {
            return true;
          }
          return false;
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

.has-modal {
  cursor: pointer;
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

.cosmetic__picture img {
  position: relative;
  z-index: 2;
  width: 200px;
  height: 200px;
  margin: 0 auto;
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
