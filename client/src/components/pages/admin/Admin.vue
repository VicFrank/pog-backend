<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Admin</h1>
      <div class="container">
        <b-card no-body>
          <b-tabs pills card>
            <b-tab title-link-class="tab" title="Players" active>
              <PlayersAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Cosmetics">
              <CosmeticsAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Battle Pass">
              <BattlePassAdmin />
            </b-tab>
            <b-tab title-link-class="tab" title="Quests / Achievements">
              <QuestsAdmin />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import BattlePassAdmin from "./BattlePassAdmin";
import CosmeticsAdmin from "./CosmeticsAdmin";
import PlayersAdmin from "./PlayersAdmin";
import QuestsAdmin from "./QuestsAdmin";
export default {
  components: {
    BattlePassAdmin,
    CosmeticsAdmin,
    PlayersAdmin,
    QuestsAdmin
  }
};
</script>

<style>
.tab {
  color: black !important;
  font-size: 16px;
  letter-spacing: normal;
}

.tab.active {
  color: white !important;
}

.card-body {
  color: black;
}
</style>
