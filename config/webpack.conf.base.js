const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: 'scmsmodules-runner/app/main',
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
  },
  resolve: {
    alias: {
      scmsModules: path.resolve(__dirname, '../src/'),
      scmsmodules: path.resolve(__dirname, '../'),
    },
  },
  plugins: [
    new CaseSensitivePlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../node_modules/scmsmodules-runner/app/index.html'),
    }),
  ],
  externals: {
    jquery: 'jQuery',
    angular: 'angular',
  },
};