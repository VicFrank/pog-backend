.<template>
  <div class="main-layout">
    <div class="main-layout__sidebar">
      <div class="sidebar-content">
        <div class="user-info">
          <h3>SUNSfan</h3>
          <img src="../assets/sunsfan.svg" alt />
          <div class="notification">
            <span class="custom-badge">4</span>
          </div>
        </div>

        <ul class="sidebar-nav">
          <li class="sidebar-nav__item">
            <a href="/" class="sidebar-nav__link sidebar-nav__link_battlepass active">Battle Pass</a>
          </li>

          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_armory">Armory</a>
          </li>

          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_achievements">Achievements</a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_dailyquest">Daily Quests</a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_stats">Stats</a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_friends">Friends</a>
          </li>
          <li class="sidebar-nav__item">
            <a href="#" class="sidebar-nav__link sidebar-nav__link_settings">Settings</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-layout__content">
      <div class="content">
        <h1 class="page-title">Battle pass</h1>
        <ul class="battlepass-timeline">
          <li>
            <div class="direction-l">
              <span>Level 1</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl1.svg" alt />
              </div>
            </div>
          </li>

          <li>
            <div class="direction-r">
              <span>Level 2</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl2.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-l">
              <span>Level 3</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl3.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-r">
              <span>Level 4</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl4.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-l">
              <span>Level 5</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl2.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-r">
              <span>Level 6</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl1.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-l">
              <span>Level 7</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl3.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-r">
              <span>Level 8</span>
              <div class="lvl-wrapper">
                <img src="../assets/lvl4.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-l">
              <span>Level 9</span>
              <div class="lvl-wrapper lvl-locked">
                <img src="../assets/lvl3.svg" alt />
              </div>
            </div>
          </li>
          <li>
            <div class="direction-r">
              <span>Level 10</span>
              <div class="lvl-wrapper lvl-locked">
                <img src="../assets/lvl2.svg" alt />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>