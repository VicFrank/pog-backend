<template>
  <b-icon icon="justify" aria-hidden="true" font-scale="2" class="icon-button" @click="handleClick"></b-icon>
</template>

<script>
export default {
  name: "sidebar-toggle",
  computed: {
    // this is for if we want the hamburger's style to
    // change when the sidebar is open/close
    open() {
      return this.$store.state.ui.sidebarOpen;
    }
  },
  methods: {
    handleClick() {
      this.$store.dispatch("toggleSidebar");
    }
  }
};
</script>

<style scoped>
.icon-button {
  cursor: pointer;
}
</style>
