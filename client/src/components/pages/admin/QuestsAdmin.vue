<template>
  <div>
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title-link-class="tab" title="Daily Quests" active>
          <div v-for="quest in quests" :key="quest.quest_id" class="mt-2">
            <div>{{quest.quest_name}}</div>
            <div>Stat: {{quest.stat}}</div>
            <div>Required: {{quest.required_amount}}</div>
            <div>Poggers: {{quest.poggers_reward}}</div>
            <div>XP: {{quest.xp_reward}}</div>
          </div>
        </b-tab>
        <b-tab title-link-class="tab" title="Achievements">
          <div v-for="quest in achievements" :key="quest.quest_id" class="mt-2">
            <div>{{quest.quest_name}}</div>
            <div>{{quest.quest_description}}</div>
            <div>Stat: {{quest.stat}}</div>
            <div>Required: {{quest.required_amount}}</div>
            <div>Poggers: {{quest.poggers_reward}}</div>
            <div>XP: {{quest.xp_reward}}</div>
            <div>Title: {{quest.title_reward}}</div>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    quests: [],
    achievements: []
  }),

  created() {
    fetch(`/api/quests`)
      .then(res => res.json())
      .then(quests => {
        this.quests = quests.filter(quest => !quest.is_achievement);
        this.achievements = quests.filter(quest => quest.is_achievement);
      })
      .catch(err => (this.error = err));
  }
};
</script>

<style>
</style>