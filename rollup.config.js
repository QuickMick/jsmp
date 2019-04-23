import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

console.log(resolve);
export default {
  input: 'main.js',
  output: {
    file: 'public/js/bundle.js',
    format: 'iife',
    sourcemap: "inline",
    name: "TinyGolfClub"
  },
  globals: {
    DEBUG: true
  },
  plugins: [
    json(),
    resolve({
      browser: true, // Default: false
    }),
    commonjs(),
    globals(),
    builtins(),
    svelte(),
    babel({
      babelrc: false,
      presets: [
        'es2015-rollup',
        ["env", {
          modules: false
        }]
      ]
    })
  ],
  watch: {
    // chokidar: {
    // if the chokidar option is given, rollup-watch will
    // use it instead of fs.watch. You will need to install
    // chokidar separately.
    //
    // this options object is passed to chokidar. if you
    // don't have any options, just pass `chokidar: true`
    //},

    // include and exclude govern which files to watch. by
    // default, all dependencies will be watched
    exclude: ['node_modules/**']
  }
}