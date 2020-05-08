import moment from "moment";

export default {
  filters: {
    duration: function(secs) {
      return moment.duration(secs * 1000).humanize();
    },
    hhmmss: function(secs) {
      if (secs > 3600) {
        return moment.utc(secs * 1000).format("H:mm:ss");
      } else return moment.utc(secs * 1000).format("mm:ss");
    },
    parseQuestText: function(text, value) {
      if (text) {
        return text.replace("%x%", value);
      }
    },
    dateFromNow: function(value) {
      if (value) {
        return moment(String(value)).fromNow();
      }
    },
    localizeNumber: function(value) {
      if (value) {
        return value.toLocaleString();
      }
    },
    round: function(value, decimals) {
      {
        if (!value) {
          value = 0;
        }

        if (!decimals) {
          decimals = 0;
        }

        value =
          Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return value;
      }
    },
    percentage: function(value, decimals) {
      if (!value) {
        value = 0;
      }

      if (!decimals) {
        decimals = 0;
      }

      value = value * 100;
      value =
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
      value = value + "%";
      return value;
    },
  },
  create: function(Vue) {
    Object.keys(this.filters).forEach(
      function(filter) {
        Vue.filter(filter, this.filters[filter]);
      }.bind(this)
    );
  },
};
