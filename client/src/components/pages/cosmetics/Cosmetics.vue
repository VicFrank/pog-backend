<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Cosmetics</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="search-bar mb-3">
              <div class="search-input">
                <input type="text" name="search" placeholder="Search..." />
              </div>
            </div>

            <div class="cosmetic-bar">
              <div class="btns-bar">
                <input type="checkbox" id="announcer" action="applyFilters" hidden />
                <label class="btns-bar__btn btns-bar__btn_left" for="announcer">
                  <span>Companions</span>
                </label>
                <input type="checkbox" id="companions" action="applyFilters" hidden />
                <label class="btns-bar__btn" for="companions">
                  <span>Companions FX</span>
                </label>
                <input type="checkbox" id="companions-fx" action="applyFilters" hidden />
                <label class="btns-bar__btn" for="companions-fx">
                  <span>Consumables</span>
                </label>
                <input type="checkbox" id="consumables" action="applyFilters" hidden />
                <label class="btns-bar__btn" for="consumables">
                  <span>Special FX</span>
                </label>
                <input type="checkbox" id="rarity" action="applyFilters" hidden />
                <label class="btns-bar__btn" for="rarity">
                  <span>Misc</span>
                </label>
                <input type="checkbox" id="unlockables" action="applyFilters" hidden />
                <label class="btns-bar__btn btns-bar__btn_right" for="unlockables">
                  <span>All</span>
                </label>
              </div>
            </div>

            <div class="cosmetics">
              <div
                class="cosmetics__item"
                v-for="cosmetic in cosmetics"
                :key="cosmetic.cosmetic_id"
              >
                <a href="#" class="cosmetic">
                  <div class="cosmetic__picture">
                    <img v-bind:src="cosmeticImageSrc(cosmetic.cosmetic_id)" />
                  </div>
                  <div class="cosmetic__descr">
                    <div class="cosmetic__name">{{cosmeticName(cosmetic.cosmetic_id)}}</div>
                  </div>
                </a>
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
export default {
  data: () => ({
    error: "",
    cosmetics: []
  }),

  created() {
    fetch(`/api/players/${this.$store.state.auth.userSteamID}/cosmetics`)
      .then(res => res.json())
      .then(cosmetics => {
        this.cosmetics = cosmetics;
      })
      .catch(err => (this.error = err));
  },

  methods: {
    cosmeticImageSrc(cosmeticID) {
      return require(`./images/${cosmeticID}.jpg`);
    },
    cosmeticName(cosmeticID) {
      return cosmeticsData[cosmeticID].name;
    }
  }
};
</script>

<style>
</style>