<template>
  <div>
    <div v-if="!hasVoted">
      <h2 class="text-center">{{name}}</h2>
      <div class="container">
        <div class="row justify-content-md-center">
          <PollOption
            v-for="option in options"
            :key="option.option_id"
            :src="getImage(option)"
            :id="option.option_id"
            :text="option.option_text"
            v-on:vote="vote(option.option_id)"
            class="col-auto"
          />
        </div>
      </div>
    </div>
    <div v-else-if="hasVoted">
      <h3 class="text-center">Thank you for voting!</h3>
      <div class="container">
        <div class="row justify-content-md-center">
          <PollResult
            v-for="option in options"
            :key="option.option_id"
            :src="getImage(option)"
            :text="option.option_text"
            :votePercent="option.votes / totalVotes"
            class="col-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PollOption from "./PollOption";
import PollResult from "./PollResult";
export default {
  components: {
    PollResult,
    PollOption
  },

  props: {
    pollID: Number
  },

  data: () => ({
    error: "",
    showError: false,
    name: "",
    options: [],
    loading: true,
    hasVoted: false,
    totalVotes: 1
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    }
  },

  created() {
    fetch(`/api/polls/${this.pollID}/${this.steamID}`)
      .then(res => res.json())
      .then(hasVoted => {
        if (hasVoted) this.hasVoted = true;
      })
      .catch(err => {
        this.error = err;
        this.showError = true;
      });

    fetch(`/api/polls/${this.pollID}`)
      .then(res => res.json())
      .then(poll => {
        this.name = poll.poll_name;
        this.options = poll.results;
        this.loading = false;

        this.totalVotes = poll.results.reduce((acc, cur) => {
          return acc + cur.votes;
        }, 0);
      })
      .catch(err => {
        this.error = err;
        this.showError = true;
      });
  },

  methods: {
    vote(optionID) {
      fetch(`/api/polls/${this.pollID}/${this.steamID}?vote=${optionID}`, {
        method: "post"
      })
        .then(res => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then(() => {
          this.hasVoted = true;
        })
        .catch(err => {
          this.error = err;
          this.showError = true;
        });
    },

    getImage(option) {
      switch (option.option_text) {
        case "Guardian of Defense":
          return require("./images/poll-images-defense.jpg");
        case "Guardian of Thirst":
          return require("./images/poll-images-lifesteal.jpg");
        case "Guardian of Sorcery":
          return require("./images/poll-images.jpg");
      }
    }
  }
};
</script>

<style>
</style>