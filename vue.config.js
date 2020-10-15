module.exports = {
  devServer: {
    open: true
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            // rem 的单位  填设计稿的 1/10
            remUnit: 37.5,
          }),
        ],
      },
    },
  }
}