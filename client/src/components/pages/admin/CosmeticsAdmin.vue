<template>
  <div>
    <b-form-select v-model="selected" :options="options"></b-form-select>
    <div class="mt-3">
      Selected:
      <strong>{{ selected }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    options: [],
    selected: null
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then(res => res.json())
      .then(cosmetics => {
        this.options = cosmetics.map(cosmetic => ({
          value: cosmetic,
          text: cosmetic.cosmetic_id
        }));
        this.options.push({
          value: null,
          text: "Select a Cosmetic"
        });
      })
      .catch(err => (this.error = err));
  }
};
</script>

<style>
</style>