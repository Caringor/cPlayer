var webpack = require('webpack'),
    path = require('path'),
    ROOT_PATH = path.resolve(__dirname),
    SRC_PATH = path.resolve(ROOT_PATH, 'src'),
    DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  
  entry: './src/cPlayer.js',
  
  devServer: {
    publicPath: '/dist'
  },
  
  output: {
    path: DIST_PATH,
    filename: 'cPlayer.min.js',
    library: 'cPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: SRC_PATH,
        options: {
          presets: ['es2015']
        }
      }
    ]
  }
  
}
