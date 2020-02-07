<template>
  <i class="fas fa-bars fa-lg" @click="handleClick"></i>
</template>

<script>
export default {
  name: "sidebar-toggle",
  computed: {
    // this is for if we want the hamburger's style to
    // change when the sidebar is open/close
    open() {
      return this.$store.state.ui.sidebarOpen;
    },
  },
  methods: {
    handleClick() {
      this.$store.dispatch("toggleSidebar");
    },
  },
};
</script>

<style scoped>
i {
  cursor: pointer;
}
</style>
