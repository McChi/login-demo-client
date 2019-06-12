const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../../login-demo/public/'),
    filename: '[name].[hash].js'
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: []
  },
  plugins: [
    new CleanWebpackPlugin({
    // 2.x 开始允许默认选择build的路径产生path作为清除路径
    // 但是也可以自定义路径，使用cleanOnceBeforeBuildPatterns 或 cleanAfterEveryBuildPatterns
      verbose: false,
      dry: false
    })
  ]
});
