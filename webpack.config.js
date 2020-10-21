const path = require('path');
const pkg = require('./package.json');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const resolve = relativePath => path.resolve(__dirname, relativePath);

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: resolve('dist'),
    filename: 'onc.js',
    library: 'onc',
    libraryTarget: 'umd',
  },
  optimization: {
    providedExports: true,
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                useBuiltIns: 'entry',
                corejs: 3,
                targets: {
                  browsers: Object.values(pkg.browserslist.modernBrowsers),
                },
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    // new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
    }),
  ],
  externals: {
    localforage: {
      root: 'Localforage',
      commonjs2: 'localforage',
      commonjs: 'localforage',
      amd: 'localforage',
    },
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue',
    },
  },
};
