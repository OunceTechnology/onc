import auto from '@rollup/plugin-auto-install';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import pkg from './package.json';

const dependencies = pkg.dependencies || {};
const env = process.env.BROWSERSLIST_ENV || 'defaults';
const extraPath = env === 'defaults' ? '.fallback' : '';

const dirname = path.dirname(pkg.main);
const basename = path.basename(pkg.main, '.js');

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
