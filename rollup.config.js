// @rollup/plugin-
import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

/** @type {import('rollup').RollupOptions} */
const config = {
    input: [
        'src/entry.ts'
    ],
    output: {
        file: 'index.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        json(),
        typescript(),
        cjs()
    ]
}

export default config;