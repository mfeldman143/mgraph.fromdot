import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  // ES Module build
  {
    input: 'index.js',
    output: {
      file: 'dist/mgraph.fromdot.esm.js',
      format: 'es'
    },
    plugins: [
      nodeResolve(),
      commonjs()  // Add this plugin
    ],
    external: ['mgraph.graph']
  },
  // UMD build
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/mgraph.fromdot.umd.js',
        format: 'umd',
        name: 'mgraphFromDot',
        exports: 'default'
      },
      {
        file: 'dist/mgraph.fromdot.umd.min.js',
        format: 'umd',
        name: 'mgraphFromDot',
        exports: 'default',
        plugins: [terser()]
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs()  // Add this plugin
    ]
  }
];