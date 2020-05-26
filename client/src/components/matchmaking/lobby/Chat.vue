<template>
  <div>
    <div class="chat-box">
      <div v-for="(message, index) of messages" :key="index">
        <span class="chat-username">{{message.username}}</span>:
        <span class="chat-messsage">{{message.message}}</span>
      </div>
    </div>
    <b-form inline @submit="sendChatMessage">
      <b-input v-model="nextMessage" class="chat-text-box"></b-input>
      <b-button type="submit" variant="primary">Chat</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    nextMessage: ""
  }),
  computed: {
    messages() {
      return this.$store.getters.chatMessages;
    }
  },
  methods: {
    sendChatMessage(e) {
      e.preventDefault();

      if (this.nextMessage == "") return;
      this.nextMessage = this.nextMessage.substring(0, 500);

      // send the message using the websocket
      this.$store.dispatch("addMessage", this.nextMessage);

      // clear the message
      this.nextMessage = "";
    }
  }
};
</script>

<style scoped>
.chat-box {
  overflow: auto;
  background-color: #2b3341;

  max-width: 700px;
  height: 200px;

  padding: 10px;

  font-size: 18px;
}

.chat-username {
  color: #0b86c4;
}

.chat-message {
  color: #fff;
}

.chat-text-box {
  min-width: 600px;
}
</style>