module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
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
};
