<template>
  <div>
    <h2>Lobbies</h2>
    <table class="table">
      <tbody>
        <LobbyPreview v-for="lobby of lobbies" :key="lobby.id" :lobby="lobby" />
        <LobbyPreview v-for="i in numEmptyLobbies" :key="`empty-lobby${i}`" />
      </tbody>
    </table>
  </div>
</template>

<script>
import LobbyPreview from "./LobbyPreview";
export default {
  components: {
    LobbyPreview
  },
  computed: {
    lobbies() {
      return this.$store.getters.lobbies;
    },
    numEmptyLobbies() {
      const minLobbies = 8;
      const numLobbies = this.lobbies.length;
      if (numLobbies < minLobbies) {
        return minLobbies - numLobbies;
      }
      return 0;
    }
  }
};
</script>

<style></style>
