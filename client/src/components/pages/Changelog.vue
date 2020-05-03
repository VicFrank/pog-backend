<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Change Log</h1>
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="pl-3 change-log">
              <div v-for="change of changes" :key="change.timestamp">
                <h3 v-if="change.title">{{change.title}}</h3>
                <h4>Update: {{ getTime(change.timestamp * 1000) }}</h4>
                <ul>
                  <li v-for="line of change.lines" :key="line">{{ line }}</li>
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
    changes: []
  }),

  created() {
    fetch("/api/steam/changelog")
      .then(res => res.json())
      .then(res => {
        let changes = res.changes;

        changes = changes.map(change => {
          const description = change.change_description;
          // parse underlines
          let underlineStart = description.indexOf("[u]");
          let underlineEnd = description.indexOf("[/u]");
          let title;

          if (underlineStart >= 0 && underlineEnd >= 0) {
            title = description.substring(underlineStart + 3, underlineEnd);
          }

          let lines = description.split(/\r?\n/);

          if (title) lines.shift();

          lines = lines
            .filter(line => line != "")
            .map(line => {
              if (line.charAt(0) === "*") {
                return line.substring(2);
              }
              return line;
            });

          return {
            ...change,
            title,
            lines
          };
        });

        this.changes = changes;
      })
      .catch(err => console.error(err));
  },

  methods: {
    getTime(timestamp) {
      return new Date(timestamp).toLocaleDateString("en-us");
    }
  }
};
</script>

<style></style>
