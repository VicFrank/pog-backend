<template>
  <div class="main-layout__content">
    <div class="container">
      <h1 class="page-title">Frequently Asked Questions</h1>
      <div class="question">Is this Free to Play?</div>
      <div
        class="answer"
      >Yes! Dota 2 is completely free to play and this custom game within the client is also free.</div>
      <div class="question">How do I install?</div>
      <div
        class="answer"
      >Open your Dota 2, navigate to the Arcade tab, and search for Path of Guardians. Install the game and you're good to go!</div>
      <div
        class="question"
      >I'm getting an error when loading a game "Custom game archive does not match the lobby leader"</div>
      <div class="answer">
        This is a very common issue with custom games. The error message essentially means that you or the host's custom game are not fully updated. There are a few ways to ensure you have the latest update.
        <ul>
          <li>
            Option 1:
            <ul>
              <li>Uninstall the custom game</li>
              <li>Close your Dota client completely</li>
              <li>Open your Dota again</li>
              <li>Install the Custom game mode (You should see a download progress bar. If it is instant, then it did not work)</li>
            </ul>
          </li>
          <li>
            Option 2:
            <ul>
              <li>Uninstall the Custom game</li>
              <li>Install it again</li>
              <li>If you see a download progress bar, then it should work. If you do NOT see it, it definitely did NOT work.</li>
            </ul>
          </li>
          <li>
            Option 3:
            <ul>
              <li>Close your Dota</li>
              <li>Go into Steam/Library and then click on the Downloads button at the bottom</li>
              <li>There should be a download button for Dota 2 Workshop</li>
              <li>Once completed, Open Dota</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="question">What are Guardians?</div>
      <div
        class="answer"
      >Guardians are Mini-bosses that can be found on opposite sides of the map. Whichever team slays the beast will be provided with a buff for 5 minutes. You can learn more about their skills and buffs  <a href="https://www.pathofguardians.com/demo/guardians" target="_blank">here</a>. There are currently 3 Guardians in the game (only 2 can be spawned at one time).</div>
      <div class="question">What are POGGERS?</div>
      <div
        class="answer"
      >POGGERS stands for Path of Guardians Growth Experience Reward System. Yes, we forced that one pretty hard. POGGERS are the in-game currency for this custom game. You get this currency simply by playing the game. You can also purchase them with real money. <a href="https://www.pathofguardians.com/demo/store" target="_blank">Visit our Store</a> to see a full list of cosmetics that can be purchased with POGGERS.</div>
      <div class="question">Is the Battle Pass free?</div>
      <div
        class="answer"
      >Yes! You will receive XP for simply playing games, which will level your Battle Pass. You can also receive XP by completing achievements and daily quests. In addition, you can purchase an XP booster which will help you level your Battle Pass even faster.</div>
      <div class="question">How do I unlock the 4th picking slot?</div>
      <div
        class="answer"
      >The 4th slot can be unlocked by gaining level 40 in your Battle Pass.</div>
      <div class="question">How do re-rolls work and how can I get more?</div>
      <div
        class="answer"
      >Every game you will receive 1 free re-roll. The Battle Pass has several unlocks that will give you additional re-rolls per day.</div>
      <div class="question">Where can I hang out with other POG players?</div>
      <div class="answer">
        Come chill in our
        <a href="http://discord.gg/sunsfan" target="_blank">Discord Channel</a>
      </div>
      <div class="question">Will there be custom heroes?</div>
      <div
        class="answer"
      >Yes! We have many custom heroes in the works that we plan to announce more on in the near future.</div>
      <div class="question">Where can I report bugs?</div>
      <div class="answer">Please report bugs via the <a href="https://www.reddit.com/r/DotaCinema/" target="_blank">DotaCinema subreddit</a>.</div>
     
     <div class="question">How do the Healing Pods work?</div>
      <div
        class="answer"
      >A healing pod will drop randomly upon the death of creeps. They will stay indefinitely on the ground until a hero walks over to activate them. Once activated, pods will provide healing and mana regeneration to ANY heroes that are within the given area after a 3 second period. This 3 second period should be ovvious via both visually and audio cues. The regeneration will not be canceled from taking damage, but the pods themselves to not stack. If you activate multiple pods on top of each other, they will instead refresh the duration of the regeneration buff.</div>
       
       <div class="question">Will you be balancing heroes specifically for this mode?</div>
      <div
        class="answer"
      >We will be gathering data during the open beta period to see if this is necessary. There are certainly some heroes that are very good in this mode specifically, but we also want to make sure we don't overwhelm newer players to a bunch of changes to the heroes themselves (at least not right away). Based on both data and feedback we will consider tweaking certain heroes. </div>
    <div
        class="question"
      >When there is a gameplay patch for Dota, does it automatically apply to POG?</div>
      <div class="answer">This is a tricky question to answer. For number changes, it almost always updates automatically. There are some exceptions for certain items that we've had to re-create with special effects (Pipe, Shivas, etc). When things like hero stats/talents/aghs are changed, they should work right away in our mod. However, there are times when an update could break custom games in general. In these rare cases, you can expect a speedy update from us to remedy the situation.</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.question {
  color: #0b86c4;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

.answer {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.2;
}
</style>
