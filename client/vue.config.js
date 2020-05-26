module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
      "/ws/": {
        target: "ws://localhost:3000",
        secure: false,
        ws: true,
      },
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        moment: "moment/src/moment",
      },
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 1000 }));
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
};
