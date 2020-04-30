<template>
  <div class="container">
    <h1 class="title mt-3 mb-4">Path of Guardians</h1>
    <div class="row">
      <div class="trailer">
        <b-embed type="iframe" src="https://www.youtube.com/embed/N57IyqO86dc" allowfullscreen></b-embed>
      </div>
    </div>
    <div class="row ml-1">
      <p>
        Path of Guardians (POG) is a custom game mode created by DotaCinema.
        It is currently in Beta. The goal of this custom game is to create
        a casual, stress-free environment for those that are looking for an
        alternative to the regular grind of ranked Dota 2. Whether you're a
        veteran player, or someone who stopped playing Dota a long time ago,
        or have never even played Dota before, we want this to be a welcome
        experience for all. This custom game is loosely inspired by ARAM,
        which in turn was also inspired by a Warcraft 3 mod.
      </p>
    </div>
    <div class="row">
      <b-button
        class="mx-auto"
        href="https://steamcommunity.com/sharedfiles/filedetails/?id=2077900442"
        target="_blank"
        variant="primary"
      >PLAY NOW</b-button>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/bullet_01_general.png" alt="general" />
      </div>
      <div class="col-sm my-auto">
        <h2>General</h2>
        <ul>
          <li>Single lane 3v3</li>
          <li>Purchaseable neutral items</li>
          <li>Tier 1, Tier 2 and two Tier 3 Towers protect the Ancient</li>
          <li>One Barracks - when destroyed, will deploy Mega Creeps</li>
          <li>Four minute Day/Night cycle</li>
        </ul>
        <p>This is a condensed version of Dota 2. We want it to be as accessible as possible. As a result, many Neutral items can be purchased, and will occupy a regular item slot. The end goal is the same, destroy the enemy Ancient to win!</p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2>Low Stress & Fast Paced</h2>
        <ul>
          <li>Accelerated XP/Gold</li>
          <li>Partially shared XP/Gold between teammates</li>
          <li>Accelerated respawn times</li>
          <li>Creeps spawn every 15 seconds</li>
          <li>No gold lost on death</li>
          <li>Reduced Buyback cooldown</li>
          <li>Infinite, 0 mana TPs</li>
          <li>Fountain deals more damage, has multishot, and applies Break</li>
          <li>After 20 minutes, all buildings explode, exposing the Ancients and giving both teams Mega Creeps</li>
        </ul>
        <p>Fast paced but low-stress! You can finally stop worrying about last hits as gold is partially shared. Games will typically take between 10-15 minutes. They won't go much longer, trust us!</p>
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
        <h2>Restrictions</h2>
        <ul>
          <li>No couriers</li>
          <li>Can't pick up & deliver other players' items</li>
          <li>Can't purchase consumable regen (tangos, healing salves, clarities, etc.)</li>
        </ul>
        <p>To prevent snowballing, we've kept to the spirit of ARAM by restricting certain aspects of the game. It's a give and take. Is it worth it to go back to base to pick up your items, or should you continue to fight?</p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2>Regeneration</h2>
        <ul>
          <li>Two shrines provide 150% regeneration with a 2 minute cooldown</li>
          <li>Healing pods randomly appear after creeps die. Once activated, they provide hp/mana regeneration to units after 3 seconds</li>
          <li>Fountains regen at 50%</li>
        </ul>
        <p>Regeneration can be found aplenty in POG, just not in the usual places. Be sure to make use of the very low cooldown Shrines, and protect them at all cost!</p>
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
        <h2>Guardians</h2>
        <ul>
          <li>
            There are two Guardian pits on the map (
            <a
              href="https://www.pathofguardians.com/guardians"
              target="_blank"
            >three total Guardians</a>). Killing them provides a buff to your team for 5 minutes.
          </li>
          <li>Both teams have vision of the North Guardian during the day, and the South Guardian at night</li>
        </ul>
        <p>The Path of Guardians is protected by Ancient beings with very silly names. Defeat them to give your team an extra boost!</p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2>Companions</h2>
        <ul>
          <li>Equip companions to be at your side</li>
          <li>Make them pretty with various effects</li>
        </ul>
        <p>Haven't you always wanted to be followed around by a cute little companion? Unless, of course, you get Parasight, the most hideous thing in existence.</p>
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
        <h2>Battle Pass & Progression System</h2>
        <ul>
          <li>Free to all</li>
          <li>
            Level your
            <a
              href="https://www.pathofguardians.com/profile/battle_pass"
              target="_blank"
            >Battle Pass</a> to upgrade item effects and much more!
          </li>
          <li>Complete daily quests to give XP and POGGERS</li>
          <li>Finish long term Achievements to further increase your XP and POGGERS</li>
        </ul>
        <p>
          Just in case you needed another reason to keep playing POG, we've implemented a progression system that will be ever-evolving. Also be sure to keep an eye on the
          <a
            href="https://www.pathofguardians.com/store"
            target="_blank"
          >Store Page</a> for weekly sales!
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm my-auto">
        <h2>Custom Heroes</h2>
        <ul>
          <li>Many custom heroes will be available to play in the future</li>
        </ul>
        <p>Piggybacking off the work we did in our original CHIP mod, we plan to release custom heroes in the future. More information will be available at a later time.</p>
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
