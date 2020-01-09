<template>
  <div id="app">
    <Header />
    <Home />
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";

export default {
  name: "app",
  components: {
    Home,
    Header
  }
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

body {
  background-color: rgba(14, 19, 23, 0.94);
  font-family: "Radiance-Regular";
  font-size: 1em;
  color: #fcfcfc;
  line-height: 1em;
}

ul {
  padding: 8px 0 0;
}

li {
  list-style: none;
  text-decoration: none;
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

.main-layout__sidebar {
  width: 220px;
  position: fixed;
  height: 100%;
  z-index: 5;
  border-right: 1px solid rgba(44, 133, 199, 0.2);
}

.main-layout__sidebar {
  top: 0;
  z-index: 5;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.main-layout__sidebar {
  top: 0;
  z-index: 5;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.sidebar-content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  height: 100%;
}

.sidebar-content .user-info {
  padding: 120px 0 15px 0;
}

.sidebar-content .user-info img {
  height: 150px;
  width: 150px;
  display: block;
  margin: 0 auto;
  border: solid 1px #0b86c4;
}

.sidebar-content h3 {
  font-size: 22px;
  font-weight: 600;
  font-family: "Radiance-Semibold";
  letter-spacing: 1px;
  text-align: center;
  color: #0b86c4;
}

.notification {
  position: relative;
}

.custom-badge {
  position: absolute;
  right: 40px;
  bottom: -15px;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #0b86c4;
  font-size: 18px !important;
  color: #fcfcfc;
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

.sidebar-nav {
  width: 100%;
  margin: 70px 0 0 0;
  padding: 0;
}

.sidebar-nav__item {
  position: relative;
}

.sidebar-nav__link {
  position: relative;
  letter-spacing: 1px;
  display: flex;
  padding: 14px 8px 14px 55px;
  transition: 0.2s ease;
  color: #fff;
}

.sidebar-nav__link:after,
.sidebar-nav__link:before {
  content: "";
}

.sidebar-nav__link:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-left: 3px solid #0b86c4;
  background: linear-gradient(
    90deg,
    rgba(83, 169, 255, 0.1) 0%,
    rgba(83, 169, 255, 0.0001) 100%,
    rgba(83, 169, 255, 0.1) 100%
  );
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease;
}

.sidebar-nav__link:before {
  position: absolute;
  left: 20px;
  top: -3px;
  bottom: 0;
  margin: auto 14px auto 0;
  background-size: 100%;
}

.sidebar-nav__link.active {
  color: #0b86c4;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 1px;
  text-decoration: none;
}

.sidebar-nav__link.active:after {
  opacity: 1;
  visibility: visible;
}

.sidebar-nav__link:hover:not(.active) {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 1px;
}

.sidebar-nav__link:hover:not(.active):after {
  content: "";
  opacity: 1;
  visibility: visible;
}

.sidebar-nav__link_battlepass:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/book.svg");
}

.sidebar-nav__link_armory:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/columns.svg");
}

.sidebar-nav__link_battlepass:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/book.svg");
}

.sidebar-nav__link_achievements:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/gift.svg");
}

.sidebar-nav__link_dailyquest:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/calendar-alt.svg");
}

.sidebar-nav__link_stats:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/chart-bar.svg");
}

.sidebar-nav__link_friends:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/users.svg");
}

.sidebar-nav__link_settings:before {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-image: url("./assets/cog.svg");
}

.main-layout__content {
  display: flex;
  flex-direction: column;
  /* min-width: 980px; */
  width: 100%;
  flex-grow: 1;
  padding-left: 180px;
}

.main-layout__content {
  overflow: hidden;
}

.content {
  /* min-width: 780px; */
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
</style>
