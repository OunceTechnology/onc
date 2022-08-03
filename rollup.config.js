import auto from '@rollup/plugin-auto-install';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import path from 'node:path';
import package_ from './package.json';
import process from 'node:process'

const dependencies = package_.dependencies || {};
const environment = process.env.BROWSERSLIST_ENV || 'defaults';
const extraPath = environment === 'defaults' ? '.fallback' : '';

const dirname = path.dirname(package_.main);
const basename = path.basename(package_.main, '.js');

const filename = path.join(dirname, `${basename}${extraPath}.js`);
export default {
  input: 'src/index.js',
  output: [
    {
      file: filename,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    // cleaner({
    //   targets: ['./dist/'],
    // }),
    auto(),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'entry',
            corejs: 3,
          },
        ],
      ],
    }),
  ],
  external: Object.keys(dependencies),
};
