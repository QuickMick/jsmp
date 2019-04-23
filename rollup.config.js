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
        ['env', {
          modules: false
        }]
      ]
    })
  ]
}