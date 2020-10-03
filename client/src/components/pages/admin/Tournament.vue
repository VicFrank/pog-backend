<template>
  <div>
    <h2>Manage Tournaments</h2>
    <b-card no-body>
      <b-form-textarea
        id="textarea"
        v-model="steamLinksRawText"
        placeholder="Enter new line seperated steamcommunity links"
        rows="5"
      ></b-form-textarea>

      <pre class="mt-3">{{ parsedSteamLinks }}</pre>

      <b-spinner v-if="loading" label="Loading..."></b-spinner>

      <b-alert v-model="showError" variant="danger" dismissible>{{
        error
      }}</b-alert>
      <b-alert v-model="showSuccess" variant="success" dismissible>{{
        success
      }}</b-alert>

      <b-button
        type="submit"
        variant="primary"
        class="mt-3"
        @click="parseSteamLinks()"
        >Parse Steam IDs</b-button
      >

      <b-button
        type="submit"
        variant="primary"
        class="mt-3"
        :disabled="parsedSteamLinks.length === 0"
        @click="enterTournament()"
        >Enter Tournament</b-button
      >

      <b-button
        type="submit"
        variant="danger"
        class="mt-3"
        @click="endTournament()"
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
    loading: false,
    showSuccess: false,
    showError: false,

    steamLinksRawText: "",
    parsedSteamLinks: [],
  }),

  methods: {
    async parseSteamLinks() {
      this.loading = true;
      Promise.all(
        this.steamLinksRawText.split("\n").map(async (url) => {
          const steamID = await this.getSteamIDFromURL(url);
          return {
            url,
            steamID,
          };
        })
      ).then((res) => {
        this.loading = false;
        this.parsedSteamLinks = res;
      });
    },
    async getSteamIDFromURL(url) {
      if (!url) return;

      const split = url.split("/");
      let vanity;

      // parse the vanity from the url
      // if it's just a username, use it
      // otherwise it should be the 5th part
      if (split.length === 1) vanity = split[0];
      else if (split.length < 4) return null;
      else vanity = split[4];

      if (!vanity) return;

      try {
        const res = await fetch(
          `/api/tournaments/ResolveVanityURL/?vanity=${vanity}`
        );
        const { data } = await res.json();

        return data.response.steamid;
      } catch (error) {
        throw error;
      }
    },
    enterTournament() {
      if (this.parsedSteamLinks.length === 0) return;

      const data = this.parsedSteamLinks
        .filter((player) => player.steamID != null)
        .map((player) => player.steamID);

      this.loading = true;

      fetch(`/api/tournaments/enter`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          this.success = res.message;
          this.showSuccess = true;
        })
        .catch((err) => {
          this.error == err;
          this.showError = true;
          this.loading = false;
        });
    },
    endTournament() {
      this.loading = true;

      fetch(`/api/tournaments/end`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          this.success = res.message;
          this.showSuccess = true;
        })
        .catch((err) => {
          this.error == err;
          this.showError = true;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>