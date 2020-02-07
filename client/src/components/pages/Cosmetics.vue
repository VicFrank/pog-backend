<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Cosmetics</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="search-bar">
              <div class="search-input">
                <input type="text" name="search" placeholder="Search..." />
              </div>
            </div>

            <div class="cosmetic-bar pl-5 pt-5">
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
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>