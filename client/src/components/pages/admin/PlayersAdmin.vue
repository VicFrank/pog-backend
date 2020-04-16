<template>
  <div>
    <b-alert v-if="error != ''" show variant="danger" dismissible>{{
      error
    }}</b-alert>
    <b-alert v-if="success != ''" show variant="success" dismissible
      >Transaction Success!</b-alert
    >
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div>Your SteamID is: {{ yourSteamID }}</div>
    <b-form-input
      v-model="steamID"
      placeholder="Enter Steam ID..."
    ></b-form-input>
    <b-button
      type="submit"
      variant="primary"
      class="mt-3"
      @click="getPlayerData(steamID)"
      >Find Player</b-button
    >

    <b-card
      v-if="playerData.username"
      :title="playerData.username"
      :sub-title="playerData.steam_id"
      class="mt-3"
    >
      <b-list-group flush>
        <b-list-group-item>
          Poggers {{ playerData.poggers }}
          <b-button v-b-modal.modal-1 variant="success" size="sm" class="ml-5"
            >+</b-button
          >
          <b-modal id="modal-1" title="Give Poggers" @ok="givePoggers">
            <b-form-input type="number" v-model="poggers"></b-form-input>
          </b-modal>
        </b-list-group-item>
        <b-list-group-item
          >Patreon Level {{ playerData.patreon_level }}</b-list-group-item
        >
        <b-list-group-item>MMR {{ playerData.mmr }}</b-list-group-item>
        <b-list-group-item
          >Battle Pass XP:
          {{ playerData.battlePass.total_experience }}</b-list-group-item
        >
        <b-list-group-item
          >Battle Pass Tier: {{ playerData.battlePass.tier }}</b-list-group-item
        >
      </b-list-group>
    </b-card>

    <b-card title="Cosmetics">
      <b-button v-b-toggle.collapse-1 variant="primary">Give Items</b-button>
      <b-collapse id="collapse-1" class="mt-2 mb-2">
        <b-card>
          <b-form-select
            v-model="selected"
            :options="options"
            multiple
          ></b-form-select>
          <div class="mt-3">
            <strong>{{ selected }}</strong>
          </div>
          <b-button variant="success" class="mt-2" @click="addCosmeticItem"
            >Add</b-button
          >
        </b-card>
      </b-collapse>
      <b-list-group-item
        v-for="cosmetic in cosmetics"
        :key="cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped"
        class="mt-2"
      >
        {{ cosmetic.cosmetic_id }}
        <span v-if="cosmetic.equipped">: Equipped</span>
      </b-list-group-item>
    </b-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    steamID: "",
    playerData: {},
    cosmetics: [],
    options: [],
    selected: [],
    loading: false,
    success: "",
    poggers: 0,
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.options = cosmetics.map((cosmetic) => ({
          value: cosmetic,
          text: cosmetic.cosmetic_id,
        }));
        this.options.push({
          value: null,
          text: "Select a cosmetic to add...",
        });
      })
      .catch((err) => (this.error = err));
  },

  computed: {
    yourSteamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  methods: {
    getPlayerData(steamID) {
      fetch(`/api/players/${steamID}`)
        .then((res) => res.json())
        .then((playerData) => {
          this.playerData = playerData;
          if (!this.playerData.username) {
            this.error = "No player with this SteamID found";
          }
        })
        .catch((err) => (this.error = err));

      fetch(`/api/players/${steamID}/cosmetics`)
        .then((res) => res.json())
        .then((cosmetics) => {
          this.cosmetics = cosmetics;
        })
        .catch((err) => (this.error = err));
    },
    addCosmeticItem() {
      const selectedItems = this.selected;
      let items = {};
      let companions = [];
      for (const item of selectedItems) {
        if (item.cosmetic_type == "Companion") {
          companions.push({
            name: item.cosmetic_id,
            effect: "-1",
            level: "1",
            amount: "1",
          });
        } else {
          items[item.cosmetic_id] = "1";
        }
      }
      const transaction = {
        itemTransaction: {
          items,
          companions,
        },
      };

      this.selected = [];
      this.doTransaction(transaction);
    },
    givePoggers() {
      this.doTransaction({
        itemTransaction: {
          poggers: this.poggers,
        },
      });
    },
    doTransaction(transaction) {
      this.loading = true;

      fetch(`/api/players/${this.steamID}/transaction`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.success = res.message;
          this.getPlayerData(this.steamID);
          document.documentElement.scrollTop = 0;
        })
        .catch((err) => {
          this.error == err;
          this.loading = false;
          document.documentElement.scrollTop = 0;
        });
    },
  },
};
</script>

<style>
.add-button {
  font-size: 26px;
}
</style>
