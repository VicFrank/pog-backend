<template>
  <div class="container">
    <h1 class="title mt-3 mb-4" v-t="'home.page_title'"></h1>
    <div class="row">
      <div class="trailer">
        <b-embed type="iframe" src="https://www.youtube.com/embed/N57IyqO86dc" allowfullscreen></b-embed>
      </div>
    </div>
    <div class="row ml-1">
      <p v-t="'home.row1'"></p>
    </div>
    <div class="row">
      <b-button
        class="mx-auto"
        href="https://steamcommunity.com/sharedfiles/filedetails/?id=2077900442"
        target="_blank"
        variant="primary"
        v-t="'home.play_now'"
      ></b-button>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_01_general.png" alt="general" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row2-1'"></h2>
        <ul>
          <li v-t="'home.row2-2'"></li>
          <li v-t="'home.row2-3'"></li>
          <li v-t="'home.row2-4'"></li>
          <li v-t="'home.row2-5'"></li>
          <li v-t="'home.row2-6'"></li>
        </ul>
        <p v-t="'home.row2-7'"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row3-1'"></h2>
        <ul>
          <li v-t="'home.row3-2'"></li>
          <li v-t="'home.row3-3'"></li>
          <li v-t="'home.row3-4'"></li>
          <li v-t="'home.row3-5'"></li>
          <li v-t="'home.row3-6'"></li>
          <li v-t="'home.row3-7'"></li>
          <li v-t="'home.row3-8'"></li>
          <li v-t="'home.row3-9'"></li>
          <li v-t="'home.row3-10'"></li>
        </ul>
        <p v-t="'home.row3-11'"></p>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_02_fast_paced.png" alt="Fast Paced" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_03_restrictions.png" alt="Restrictions" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row4-1'"></h2>
        <ul>
          <li v-t="'home.row4-2'"></li>
          <li v-t="'home.row4-3'"></li>
          <li v-t="'home.row4-4'"></li>
        </ul>
        <p v-t="'home.row4-5'"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row5-1'"></h2>
        <ul>
          <li v-t="'home.row5-2'"></li>
          <li v-t="'home.row5-3'"></li>
          <li v-t="'home.row5-4'"></li>
        </ul>
        <p v-t="'home.row5-5'"></p>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_04_shrine.png" alt="Shrine" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/Bullet_05_guardians.png" alt="Guardians" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row6-1'"></h2>
        <ul>
          <i18n path="home.row6-2" tag="li">
            <template v-slot:guardians>
              <a
                href="https://www.pathofguardians.com/guardians"
                target="_blank"
              >{{ $t('home.row6-link') }}</a>
            </template>
          </i18n>
          <li v-t="'home.row6-3'"></li>
        </ul>
        <p v-t="'home.row6-4'"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row7-1'"></h2>
        <ul>
          <li v-t="'home.row7-2'"></li>
          <li v-t="'home.row7-3'"></li>
        </ul>
        <p v-t="'home.row7-4'"></p>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/Bullet_06_companion.png" alt="Companion" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_07_battlepass.png" alt="Battle Pass" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row8-1'"></h2>
        <ul>
          <li v-t="'home.row8-2'"></li>
          <i18n path="home.row8-3" tag="li">
            <template v-slot:link>
              <a
                href="https://www.pathofguardians.com/profile/battle_pass"
                target="_blank"
              >{{ $t('home.row8-link1') }}</a>
            </template>
          </i18n>
          <li v-t="'home.row8-4'"></li>
          <li v-t="'home.row8-5'"></li>
        </ul>
        <i18n path="home.row8-6" tag="p">
          <template v-slot:link>
            <a
              href="https://www.pathofguardians.com/store"
              target="_blank"
            >{{ $t('home.row8-link2') }}</a>
          </template>
        </i18n>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row9-1'"></h2>
        <ul>
          <li v-t="'home.row9-2'"></li>
        </ul>
        <p v-t="'home.row9-3'"></p>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_08_custom_heroes.png" alt="Custom Heroes" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style  scoped>
h1,
h2,
h3 {
  text-transform: uppercase;
}

h3 {
  letter-spacing: 2px;
  font-weight: 800px;
  font-size: 1.5rem;
}

.title {
  text-align: center;
  font-weight: 1000;
  letter-spacing: 4px;
  color: #0b86c4;
}

.row {
  margin-top: 1rem;
}

p {
  line-height: 1.2rem;
}

ul {
  padding-left: 20px;
}

li {
  padding-bottom: 3px;
}

.trailer {
  width: 400px;
  margin: auto;
}
</style>
