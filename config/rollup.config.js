// rollup config
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import filesize from 'rollup-plugin-filesize';
import clear from 'rollup-plugin-clear';
import autoprefixer from 'autoprefixer';
import postcssCopy from 'postcss-copy';
import pkg from '../package.json';

const entryFile = './index.js';

// banner
const banner = `/* scms-modules v${pkg.version} */`

// plugins
const cssPlugin = postcss({
  extract: true,
  plugins: [
    autoprefixer(),
    postcssCopy({
      dest: './dist',
      template: 'assets/[name].[hash].[ext][query]',
    }),
  ],
});

const htmlPlugin = html();

const babelPlugin = babel({
  exclude: 'node_modules/**' // only transpile our source code
});

const plugins = [
  clear({
    targets: ['./dist'],
  }),
  resolve(),
  commonjs(),
  cssPlugin,
  htmlPlugin,
  babelPlugin,
  filesize(),
];

export default [
  {
    input: entryFile,
    external: [
      'angular-file-upload',
      'bootstrap',
      'moment',
      'angular',
    ],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    banner,
    plugins,
  },
];