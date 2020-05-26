<template>
  <td>
    <template v-if="player">
      <img :src="player.avatar" :alt="player.username" class="mr-2" />
      {{ player.username }}
      <span v-if="player.isHost" class="ml-1">(Host)</span>
    </template>
    <template v-else>
      <span class="text-muted">Empty Slot</span>
    </template>
  </td>
</template>

<script>
export default {
  props: {
    player: Object
  }
};
</script>

<style scoped>
td {
  height: 50px;
}

img {
  height: 40px;
  width: auto;
}
</style>