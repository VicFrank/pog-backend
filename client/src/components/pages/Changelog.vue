<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Change Log</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="pl-3 change-log">
              <div v-for="change of changes" :key="change.timestamp">
                <h4>Update: {{ getTime(change.timestamp * 1000) }}</h4>
                <ul>
                  <li>{{ change.change_description }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    changes: [],
  }),

  created() {
    fetch("/api/steam/changelog")
      .then((res) => res.json())
      .then((res) => {
        this.changes = res.changes;
      })
      .catch((err) => console.error(err));
  },

  methods: {
    getTime(timestamp) {
      return new Date(timestamp).toLocaleDateString("en-us");
    },
  },
};
</script>

<style></style>
