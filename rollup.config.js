import nodeResolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";
import babel from 'rollup-plugin-babel';

// export default {
//   input: './src/index.ts',
//   output: {
//     file: 'bundle.js',
//     format: 'cjs'
//   },
//   plugins: [
//     typescript()
//   ]
// }

// const bundles = [{
//     format: 'cjs',
//     ext: '.js',
//     plugins: [],
//     babelPresets: ['stage-1'],
//     babelPlugins: [
//       'transform-es2015-destructuring',
//       'transform-es2015-function-name',
//       'transform-es2015-parameters'
//     ]
//   }, {
//     format: 'es6',
//     ext: '.mjs',
//   plugins: [],
//   babelPresets: ['stage-1'],
//   babelPlugins: [
//     'transform-es2015-destructuring',
//     'transform-es2015-function-name',
//     'transform-es2015-parameters'
//   ]
// }];

export default {
  input: './src/index.ts',
  output: {
        file: 'bundle.js',
        format: 'cjs'
      },
  plugins: [
    nodeResolve({
      jsnext: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts']
    })
  ]
}
