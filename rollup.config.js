import {nodeResolve as resolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from "rollup-plugin-terser"

const
    dev = (process.env.NODE_ENV !== 'production'),
    sourcemap = dev ? 'inline' : false

export default [
    {
        input: './src/browser.js',
        watch: { clearScreen: false },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs(),
        ],
        output: {
            file: './lib/color.js',
            format: 'iife',
        }
    },
    {
        input: './lib/color.js',
        plugins: [
            terser()
        ],
        output: {
            file: './lib/color.min.js',
            format: 'iife',
            sourcemap
        }
    }
];