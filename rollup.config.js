import * as fs from 'fs';
import svelte from 'rollup-plugin-svelte';

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

console.log(resolve);
export default {
  input: 'main.js',
  output: {
    file: 'public/js/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    svelte({
      // By default, all .svelte and .html files are compiled
      // extensions: ['.my-custom-extension'],

      // You can restrict which files are compiled
      // using `include` and `exclude`
      include: 'client/**/*.svelte',

      // By default, the client-side compiler is used. You
      // can also use the server-side rendering compiler
      generate: 'ssr',

      // Optionally, preprocess components with svelte.preprocess:
      // https://github.com/sveltejs/svelte#preprocessor-options
      preprocess: {
        style: ({
          content
        }) => {
          return transformStyles(content);
        }
      },

      // Emit CSS as "files" for other plugins to process
      emitCss: true,

      // Extract CSS into a separate file (recommended).
      // See note below
      css: function (css) {
        console.log(css.code); // the concatenated CSS
        console.log(css.map); // a sourcemap

        // creates `main.css` and `main.css.map` — pass `false`
        // as the second argument if you don't want the sourcemap
        css.write('public/css/main.css');
      },

      // Warnings are normally passed straight to Rollup. You can
      // optionally handle them here, for example to squelch
      // warnings with a particular code
      onwarn: (warning, handler) => {
        // e.g. don't warn on <marquee> elements, cos they're cool
        if (warning.code === 'a11y-distracting-elements') return;

        // let Rollup handle all other warnings normally
        handler(warning);
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ["env"]
    }),
  ]
}