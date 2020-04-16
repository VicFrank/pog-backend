<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Store</h1>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <h2 class="text-center blue">Featured</h2>
          <div class="featured owl-carousel owl-theme owl-dot">
            <div class="single-featured item">
              <!-- <img src="../../assets/images/featured.svg" alt /> -->
              <div class="overlay">
                <h3>Immortal Treasure III</h3>
                <p>$15.22</p>
              </div>
            </div>
            <div class="single-featured item">
              <!-- <img src="../../assets/images/featured2.svg" alt /> -->
              <div class="overlay">
                <h3>Immortal Treasure III</h3>
                <p>$15.22</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <h2 class="text-center blue">Sales</h2>
          <p class="text-center">1 day 2 hours 43mins</p>
          <div class="sale-one">
            <!-- <img src="../../assets/images/sale1.svg" alt /> -->
            <div class="overlay">
              <h3>Immortal Treasure III</h3>
              <p>$15.22</p>
            </div>
          </div>
          <div class="sale-two">
            <!-- <img src="../../assets/images/sale2.svg" alt /> -->
            <div class="overlay">
              <h3>Immortal Treasure III</h3>
              <p>$15.22</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="cosmetic-bar justify-content-center">
            <div class="btns-bar">
              <input type="checkbox" id="announcer" action="applyFilters" hidden />
              <label class="btns-bar__btn btns-bar__btn_left" for="announcer">
                <span>Announcer packs</span>
              </label>
              <input type="checkbox" id="companions" action="applyFilters" hidden />
              <label class="btns-bar__btn" for="companions">
                <span>Companions</span>
              </label>
              <input type="checkbox" id="companions-fx" action="applyFilters" hidden />
              <label class="btns-bar__btn" for="companions-fx">
                <span>Companions FX</span>
              </label>
              <input type="checkbox" id="consumables" action="applyFilters" hidden />
              <label class="btns-bar__btn" for="consumables">
                <span>Consumables</span>
              </label>
              <input type="checkbox" id="rarity" action="applyFilters" hidden />
              <label class="btns-bar__btn" for="rarity">
                <span>Rarity</span>
              </label>
              <input type="checkbox" id="special-fx" action="applyFilters" hidden />
              <label class="btns-bar__btn" for="special-fx">
                <span>Special FX</span>
              </label>
              <input type="checkbox" id="unlockables" action="applyFilters" hidden />
              <label class="btns-bar__btn btns-bar__btn_right" for="unlockables">
                <span>Unlockables</span>
              </label>
            </div>
          </div>

          <div class="cosmetics">
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic1.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Great Sage's Reckoning</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price price price-USD">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic2.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Fractal Horns of Inner Abysm</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic3.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Manifold Paradox</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic4.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Tempest Helm of the Thundergod</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div class="cosmetics">
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic1.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Great Sage's Reckoning</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price price price-USD">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic2.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Fractal Horns of Inner Abysm</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic3.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Manifold Paradox</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="cosmetics__item">
              <a href="#" class="cosmetic">
                <div class="cosmetic__picture">
                  <img src="../../assets/images/cosmetic4.svg" />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">Tempest Helm of the Thundergod</div>
                  <div class="cosmetic__price">
                    <span class="cosmetic-price">20.88</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
