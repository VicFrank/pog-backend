<template>
  <div class="vote-option">
    <div class="text-muted">{{text}}</div>
    <img :src="src" :alt="`Option ${id}`" />
    <b-button variant="primary" @click="vote" class="vote-button">Vote</b-button>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    text: String,
    id: Number
  },
  methods: {
    vote() {
      this.$emit("vote");
    }
  }
};
</script>

<style scoped>
.vote-option {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  max-width: 20rem;
}

img {
  width: 100%;
  height: auto;
}
</style>