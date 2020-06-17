module.exports = {
  publicPath: './',
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/main.js', // 必須パラメータ
      title: 'へぇボタン',
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'へぇボタン',
        copyright: 'Copyright © 2020 Kidsplates.'
      }
    }
  }
}