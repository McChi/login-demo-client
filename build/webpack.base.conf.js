const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    loginbundle: path.resolve(__dirname, '../src/login/index.js'),
    managebundle: path.resolve(__dirname, '../src/manage/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              'file-loader'
            ]
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              'file-loader'
            ]
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.css$/,
            use: [process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
            'css-loader', 'postcss-loader']
          }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/login.html'),
      filename: 'login.html', // 生成的html文件名称
      chunks: ['loginbundle']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/manage.html'),
      filename: 'manage.html',
      chunks: ['managebundle']
    }),
    new VueLoaderPlugin(),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: ['vue', 'vue-router', 'vuex', 'element-ui']
      }
    }),
    new webpack.optimize.SplitChunksPlugin()
  ],

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue'],
  }

};
