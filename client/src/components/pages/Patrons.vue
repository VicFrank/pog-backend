<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Patrons</h1>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="patrons-table my-stats">
            <table class="table">
              <tbody>
                <tr v-if="patrons.length > 0">
                  <td class="tb-head patron-name">Patron</td>
                  <td class="tb-head">Level</td>
                </tr>
                <tr v-for="patron in patrons" :key="patron.name + patron.level">
                  <td class="patron-name">{{patron.name}}</td>
                  <td>{{patron.level}}</td>
                </tr>
              </tbody>
            </table>
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
    patrons: [],
    next: ""
  }),

  created() {
    fetch(`/api/patreon/`)
      .then(res => res.json())
      .then(res => {
        this.patrons = res.pledges;
        this.next = res.next;
      });
  }
};
</script>

<style scoped>
.patrons-table {
  max-width: 400px;
  margin: auto;
}

.patron-name {
  text-align: left;
}
</style>