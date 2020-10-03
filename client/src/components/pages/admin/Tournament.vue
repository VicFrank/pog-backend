<template>
  <div>
    <h2>None of this works yet, SUNSfan</h2>
    <b-card no-body>
      <b-form-textarea
        id="textarea"
        v-model="steamLinksRawText"
        placeholder="Enter new line seperated steamcommunity links"
        rows="5"
      ></b-form-textarea>

      <pre class="mt-3 mb-0">{{ parseSteamLinks }}</pre>

      <b-button
        type="submit"
        variant="primary"
        class="mt-3"
        @click="enterTournament()"
        >Enter Tournament</b-button
      >

      <b-button
        type="submit"
        variant="danger"
        class="mt-3"
        @click="endTournament(steamID)"
        >End Tournament</b-button
      >
    </b-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    success: "",
    showSuccess: false,
    showError: false,

    steamLinksRawText: "",
  }),

  computed: {
    parseSteamLinks() {
      return this.steamLinksRawText.split("\n");
    },
  },

  methods: {    
    enterTournament() {
      if (!this.parseSteamLinks()) return;
      fetch(`/api/tournaments/end`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.parseSteamLinks()),
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          this.success = res.message;
        })
        .catch((err) => {
          this.error == err;
          this.loading = false;
        });
    },
    endTournament() {
      fetch(`/api/tournaments/end`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          this.success = res.message;
        })
        .catch((err) => {
          this.error == err;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>