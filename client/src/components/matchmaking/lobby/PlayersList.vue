<template>
  <table class="table">
    <!-- <tbody>
      <tr>
        <td class="team-header radiant-color">Lorekeepers</td>
      </tr>
      <tr v-for="i in 3" :key="i">
        <Player :player="radiant[i-1]" />
      </tr>
      <tr class="mt-3">
        <td class="team-header dire-color">Flameguard</td>
      </tr>
      <tr v-for="i in 3" :key="3+i">
        <Player :player="dire[i-1]" />
      </tr>
    </tbody>-->
    <tbody>
      <tr>
        <td class="team-header">Players</td>
      </tr>
      <tr v-for="i in 6" :key="i">
        <Player :player="players[i-1]" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import Player from "./Player";
export default {
  components: {
    Player
  },
  computed: {
    // radiant() {
    //   return this.$store.getters.radiantPlayers;
    // },
    // dire() {
    //   return this.$store.getters.direPlayers;
    // }
    players() {
      return this.$store.getters.lobbyPlayers;
    }
  }
};
</script>

<style scoped>
table {
  max-width: 700px;
}

.team-header {
  height: 50px;
  text-transform: uppercase;
}
</style>