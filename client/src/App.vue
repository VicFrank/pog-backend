<template>
  <div id="app">
    <Header v-if="!this.isRoot" />
    <div class="main-layout">
      <Sidebar v-if="!this.isRoot" />
      <div v-bind:class="{ 'sidebar-open': sidebarOpen, 'neutral-div': true }">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "app",
  computed: {
    isRoot() {
      return this.$route.path === "/";
    },
    sidebarOpen() {
      return this.$store.state.ui.sidebarOpen;
    },
  },
  components: {
    Header,
    Sidebar,
  },
};
</script>

<style>
@font-face {
  font-family: "Radiance-Regular";
  src: url("./assets/fonts/Radiance-Regular.otf");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Radiance-Semibold";
  src: url("./assets/fonts/Radiance-Semibold.otf");
  font-weight: normal;
  font-style: normal;
}

.sidebar-open {
  margin-left: 220px;
}

.neutral-div {
  width: 100%;
}

body {
  /* background-color: rgba(14, 19, 23, 0.94); */
  background-color: #13171d;
  font-family: "Radiance-Regular";
  font-size: 1em;
  color: #fcfcfc;
  line-height: 1em;
}

a:hover {
  text-decoration: none;
}

.win {
  color: #a9cf54;
}

.loss {
  color: #c23c2a;
}

#main-nav {
  height: 64px;
  background-image: linear-gradient(to right, #171819, #1c1c1e);
  box-shadow: 0 2px 4px rgb(11, 134, 196, 0.2);
  position: fixed;
  width: 100%;
  z-index: 10;
}

#main-nav li a:hover {
  transition: 0.2s ease;
  letter-spacing: 3.8px;
  color: #0b86c4 !important;
}

.nav-link {
  font-size: 14px;
  letter-spacing: 3.5px;
  color: #cecece !important;
}

.nav-link a:hover {
  letter-spacing: 1px;
  transition: 0.2s ease;
}

.btn {
  font-family: "Radiance-Semibold";
  font-size: 14px;
  letter-spacing: 2px;
  border-radius: 3px;
  border: solid 1px #0b86c4;
  background-color: #0b86c4;
  color: #ffffff;
  padding: 6px 30px;
}

.btn:hover {
  transform: translateY(-1px);
  transition: 0.15s ease;
  box-shadow: 0 2px 4px rgb(11, 134, 196, 0.2);
}

.main-layout {
  flex-wrap: wrap;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
}

.main-layout {
  padding-top: 84px;
  flex-wrap: wrap;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
}

.main-layout__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
}

.main-layout__content {
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
}

.page-title {
  font-size: 40px;
  font-family: "Radiance-Semibold";
  letter-spacing: 1px;
  color: #0b86c4;
  margin: 0.5em;
  text-align: center;
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
  left: 129%;
  top: -14px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 178px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 4;
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
  right: 129%;
  top: -14px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 178px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 4;
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
  text-align: center;
  top: -1em;
  box-shadow: 0 0 30px 0 rgba(11, 134, 196, 0.3);
}

.lvl-wrapper img {
  height: 150px;
}

.lvl-locked {
  box-shadow: unset;
  filter: grayscale(100%);
}

.pointer:before {
  position: absolute;
  content: " ";
  left: 175%;
  top: 40%;
  display: block;
  width: 20px;
  height: 20px;
  background: #2986c4;
  border-radius: 10px;
  border: 4px solid rgb(41, 134, 196);
  z-index: 10;
}

/* cosmetics  */

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
  background-image: url("./assets/images/icon_search.svg");
}

.cosmetic-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* padding: 20px 0 0px 40px; */
}

.btns-bar {
  display: flex;
  height: 38px;
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

.btns-bar input:checked + label {
  background-color: #0b86c4;
  border-color: #0b86c4;
  color: #fff;
}

.btns-bar input:checked + label:before {
  opacity: 1;
  visibility: visible;
}

.btns-bar input:checked + label:hover {
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
  /* margin: 0; */
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
  padding: 20px 0 30px 30px;
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
  width: 100%;
  margin: 0 auto;
}

.cosmetic__descr {
  padding-top: 20px;
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
  padding: 0 1em;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: 0.25s ease-in-out;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  font-family: "Radiance-Semibold";
}

.cosmetic__descr:after {
  width: 150px;
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

/* store */

.featured {
  position: relative;
  /* margin-top: 50px; */
  text-align: center;
  margin-bottom: 120px;
  box-shadow: 0 0 15px 0 #457296;
  transform: scale(0.76);
}

.featured h3,
.sale-one h3,
.sale-two h3 {
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
.sale-one p,
.sale-two p {
  font-size: 18px;
  font-family: "Radiance-Semibold";
  line-height: 1;
  letter-spacing: 0.45px;
  text-align: center;
  color: #0b86c4;
}

.featured img,
.sale-one img,
.sale-two img {
  position: relative;
  transition: 0.25s ease-in-out;
  width: 100%;
}

.blue {
  color: #0b86c4;
}

.overlay {
  height: 60px;
  opacity: 0.8;
  padding: 0.2em 1em 1em;
  background-color: #000000;
}

.sale-one {
  width: 60%;
  text-align: center;
  transform: scale(0.77);
  margin: 0 auto 40px;
  box-shadow: 0 0 15px 0 #457296;
}

.sale-two {
  transform: scale(0.77);
  width: 60%;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 0 15px 0 #457296;
}

/* my stats */

.table td {
  border: 0;
}

.tb-head {
  font-family: "Radiance-Semibold";
  font-size: 14px;
  font-weight: 600;
  color: #0b86c4;
  padding: 1.5em !important;
  text-transform: uppercase;
  letter-spacing: 0.75px;
}

.tb-head:hover {
  box-shadow: unset;
}

.my-stats td {
  padding: 1.5em !important;
}

tr {
  border: solid 1.1px #364552;
  background-color: #222e3b;
}

tr:nth-child(even) {
  /* background-color: #181D21; */
  background-color: #1a232b;
}

td {
  font-size: 14px;
  color: #cecece;
  letter-spacing: 0.55px;
  padding: 0 !important;
  border: 0;
  text-align: center;
  font-weight: 600;
  font-family: "Radiance-Semibold";
}

.badge img {
  width: 35px;
}

.gold-color {
  color: #fbb829 !important;
}

.radiant-color {
  color: #92a525;
}

.dire-color {
  color: #c23c2a;
}

/* match history */

.match-history th img {
  height: 40px;
  margin-right: 1em;
}

.table thead th {
  border: 0;
  text-align: center;
}

.table td,
.table th {
  border: 0;
  vertical-align: middle;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

td a {
  color: #cecece;
  text-decoration: none;
}

td a:hover {
  text-decoration: none;
  color: #0b86c4;
}

.match-history table td:hover {
  box-shadow: unset;
}

.table th a {
  color: #fcfcfc;
}

.table th a:hover {
  color: #0b86c4;
  text-decoration: none;
}

.match-item {
  position: relative;
  display: inline-block;
  text-align: center;
  margin-right: 1px;
  vertical-align: top;
}

/* changelog */

.change-log h3 {
  text-transform: uppercase;
  font-weight: normal;
  font-size: 32px;
  margin-bottom: 1em;
  letter-spacing: 3px;
  color: #0b86c4;
  text-shadow: 1px 1px 1px #000000;
}

.change-log h4 {
  margin: 1em 0;
  font-family: "Radiance-SemiBold";
  font-weight: normal;
  letter-spacing: 1px;
  font-size: 20px;
  color: #ffffff;
  text-transform: uppercase;
}

.change-log ul {
  list-style-type: disc;
  padding-bottom: 20px;
}

.change-log li {
  font-size: 18px;
  color: #808080;
  line-height: 34px;
  margin-left: -20px;
  text-shadow: 1px 1px 1px #000000;
}

/* my profile */

.view-all {
  position: absolute;
  right: 0;
  bottom: 0;
}

.view-all a {
  display: block;
  padding: 0.5em;
  background-color: #172126;
  color: #0b86c4;
  font-weight: 600;
  border: solid 1.1px #202e3a;
}

.bg-blk {
  position: relative;
  /* border: solid 1.1px #202e3a;
    background-color: #172126; */
  border: solid 1.1px #364552;
  background-color: #1a232b;
  padding-bottom: 4em !important;
}

.more {
  position: absolute;
  bottom: -27px;
  right: 5px;
  font-size: 14px;
}

.more a:hover {
  opacity: 0.8;
}

.more a:before {
  content: "";
  background-image: url(./assets/images/plus-square-solid.svg);
  height: 20px;
  width: 20px;
  right: 55px;
  fill: #fff;
  bottom: 0;
  position: absolute;
  background-repeat: no-repeat;
}

/* media queries */

@media (max-width: 575.98px) {
  .cosmetics__item {
    width: 100% !important;
  }

  .cosmetics,
  .search-bar,
  .cosmetic-bar {
    padding: 0;
  }

  .btns-bar {
    display: none;
  }
}

@media (max-width: 767.98px) {
  .main-layout__content {
    padding-left: 250px;
  }

  .achievement {
    padding: 1em 2em;
  }

  .pog-gained {
    display: none;
  }

  .xp-gained {
    display: none;
  }

  .cosmetics__item {
    width: 100% !important;
  }

  .btns-bar {
    margin-bottom: 5em;
    flex-wrap: wrap;
  }
}

@media (max-width: 991.98px) {
  .achievement {
    padding: 2em 2em;
  }

  .pog-gained {
    right: 1.5em;
    top: 30px;
  }

  .xp-gained {
    right: 1.5em;
    top: 60px;
  }
}

@media (max-width: 1199.98px) {
  .cosmetics__item {
    width: 20%;
  }
}
</style>
