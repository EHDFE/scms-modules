const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.conf.base');

const BROWSER_SUPPORTS = ['last 2 versions'];

const config = {
  output: {
    filename: '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules\/(?!scmsmodules\-runner)(?:(.)*)/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      targets: {
                        browsers: BROWSER_SUPPORTS,
                      },
                      module: false,
                      useBuiltIns: true,
                    },
                  ],
                ],
                cacheDirectory: true,
              },
            },
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: '[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    autoprefixer({
                      browsers: BROWSER_SUPPORTS,
                    }),
                  ],
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    autoprefixer({
                      browsers: BROWSER_SUPPORTS,
                    }),
                  ],
                },
              },
              'less-loader',
            ],
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  ignoreCustomFragments: [/\{\{.*?}}/],
                  interpolate: true,
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.jsx?$/, /\.json$/],
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      './build',
    ], {
      root: path.resolve(__dirname, '../'),
      verbose: true,
      dry: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
    })
  ],
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
          sourceMap: true,
          uglifyOptions: {
            mangle: false,
          },
      }),
    ],
  },
  devtool: 'source-map',
};

module.exports = merge.smart(baseConfig, config);