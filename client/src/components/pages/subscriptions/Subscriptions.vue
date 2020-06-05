<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Buy a Ticket</h1>
      <div class="container text-center">
        <div>
          <b-card-group deck>
            <b-card>
              <template v-slot:header>
                <div class="ticket-name">Silver Ticket</div>
                <img :src="ticketImage(1)" alt="Silver Ticket" />
                <div class="price">
                  <span class="cost">$2</span>
                  <span class="duration text-muted">/Mo</span>
                </div>
              </template>
              <b-card-text>
                <div class="mb-4">
                  <div class="reward-value">+100%</div>
                  <div class="reward-description">BP EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">+50%</div>
                  <div class="reward-description">First Win EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x2</div>
                  <div class="reward-description">Content Vote Weight</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x15</div>
                  <div class="reward-description">Daily Tips</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">1 POGGERS</div>
                  <div class="reward-description">Tip Amount</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">2</div>
                  <div class="reward-description">Daily Quests</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value text-muted">0</div>
                  <div class="reward-description">Weekly Quests</div>
                </div>
              </b-card-text>
              <template v-slot:footer>
                <b-button variant="primary" to="/subscriptions/tier1">Subscribe</b-button>
              </template>
            </b-card>
            <b-card>
              <template v-slot:header>
                <div class="ticket-name">Gold Ticket</div>
                <b-img :src="ticketImage(2)" alt="Gold Ticket"></b-img>
                <div class="price">
                  <span class="cost">$5</span>
                  <span class="duration text-muted">/Mo</span>
                </div>
              </template>
              <b-card-text>
                <div class="mb-4">
                  <div class="reward-value">+300%</div>
                  <div class="reward-description">BP EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">+100%</div>
                  <div class="reward-description">First Win EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x5</div>
                  <div class="reward-description">Content Vote Weight</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x15</div>
                  <div class="reward-description">Daily Tips</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">5 POGGERS</div>
                  <div class="reward-description">Tip Amount</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">3</div>
                  <div class="reward-description">Daily Quests</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">3</div>
                  <div class="reward-description">Weekly Quests</div>
                </div>
                <div class="mb-4">
                  <div class="reward-description">Detailed Website Stats</div>
                </div>
              </b-card-text>
              <template v-slot:footer>
                <b-button variant="primary" to="/subscriptions/tier2">Subscribe</b-button>
              </template>
            </b-card>
            <b-card>
              <template v-slot:header>
                <div class="ticket-name">Platinum Ticket</div>
                <b-img :src="ticketImage(3)" alt="Platinum Ticket"></b-img>
                <div class="price">
                  <span class="cost">$15</span>
                  <span class="duration text-muted">/Mo</span>
                </div>
              </template>
              <b-card-text>
                <div class="mb-4">
                  <div class="reward-value">+300%</div>
                  <div class="reward-description">BP EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">+100%</div>
                  <div class="reward-description">First Win EXP</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x10</div>
                  <div class="reward-description">Content Vote Weight</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">x15</div>
                  <div class="reward-description">Daily Tips</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">10 POGGERS</div>
                  <div class="reward-description">Tip Amount</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">3</div>
                  <div class="reward-description">Daily Quests</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">3</div>
                  <div class="reward-description">Weekly Quests</div>
                </div>
                <div class="mb-4">
                  <div class="reward-value">+25%</div>
                  <div class="reward-description">Ally BP Bonus</div>
                </div>
                <div class="mb-4">
                  <div class="reward-description">Detailed Website Stats</div>
                </div>
                <div class="mb-4">
                  <div class="reward-description">Hero Glow FX</div>
                </div>
                <div class="mb-4">
                  <div class="reward-description">Flying Honey Heist Baby Roshling</div>
                </div>
                <div class="mb-4">
                  <div class="reward-description">Honey Heist Baby Roshling FX</div>
                </div>
              </b-card-text>
              <template v-slot:footer>
                <b-button variant="primary" to="/subscriptions/tier3">Subscribe</b-button>
              </template>
            </b-card>
          </b-card-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    ticketImage(tier) {
      return require(`./images/ticketicon_${tier}.png`);
    }
  }
};
</script>

<style scoped>
.reward-description {
  color: #6c757d !important;
  text-transform: uppercase;
}
.reward-value {
  font-weight: 800;
  font-size: 22px;
  margin-bottom: 0.5rem;
}
.ticket-name {
  font-size: 24px;
}
.cost {
  font-size: 48px;
}
.duration {
  font-size: 16px;
}
.card-header {
  color: black;
}
.card-header img {
  max-width: 100%;
}
.card-body {
  color: black;
}
</style>
