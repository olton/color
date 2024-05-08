import {terser} from "rollup-plugin-terser"
import pkg from "./package.json"
import fs from "node:fs"

const production = (process.env.MODE === 'production')

const banner = `
/*!
 * Color library - Color manipulation library
 * Copyright ${new Date().getFullYear()} by Serhii Pimenov
 * Licensed under MIT
 !*/
`

let txt = fs.readFileSync(`src/index.js`, 'utf8')
txt = txt.replace(/version = ".+"/g, `version = "${pkg.version}"`)
txt = txt.replace(/build_time = ".+"/g, `build_time = "${new Date().toLocaleString()}"`)
fs.writeFileSync(`src/index.js`, txt, { encoding: 'utf8', flag: 'w+' })


export default [
    {
        input: './src/browser.js',
        watch: { clearScreen: false },
        output: {
            file: './lib/color.js',
            format: 'iife',
            sourcemap: false,
            banner,
            plugins: [
                production && terser({
                    keep_classnames: true,
                    keep_fnames: true,
                })
            ],
        }
    },
    {
        input: './src/index.js',
        watch: { clearScreen: false },
        output: {
            file: './dist/color.es.js',
            format: 'es',
            banner,
        }
    },
    {
        input: './src/index.js',
        watch: { clearScreen: false },
        output: {
            file: './dist/color.cjs.js',
            format: 'cjs',
            banner,
        }
    },
];