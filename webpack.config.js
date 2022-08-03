import { fileURLToPath } from 'node:url';
// const package_ = require('./package.json');

import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const resolve = relativePath => fileURLToPath(new URL(relativePath, import.meta.url));
const esbuildTarget = 'es2018';

export default {
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
        loader: 'esbuild-loader',
        options: {
          target: esbuildTarget,
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
