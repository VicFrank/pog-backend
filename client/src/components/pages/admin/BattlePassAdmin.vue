<template>
  <div>
    <div v-for="levelData in battlePass" :key="levelData.bp_level">
      <div>Level {{levelData.bp_level}}:</div>
      <div class="ml-3">
        <div v-if="levelData.cosmetic_id !== null">
          &nbsp;Item:
          <strong>{{levelData.cosmetic_id}}</strong>
        </div>
        <div v-if="levelData.chest_amount > 0">
          &nbsp;Chest Tier:
          <strong>{{levelData.chest}}</strong>
        </div>
        <div v-if="levelData.chest_amount > 0">
          &nbsp;Num Chests:
          <strong>{{levelData.chest_amount}}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    battlePass: [],
    selected: null
  }),

  created() {
    fetch(`/api/cosmetics/battle_pass`)
      .then(res => res.json())
      .then(battlePass => {
        this.battlePass = battlePass;
      })
      .catch(err => (this.error = err));
  }
};
</script>

<style>
</style>