// @rollup/plugin-
import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import scss from 'rollup-plugin-scss'
import babel from '@rollup/plugin-babel'

const extensions = ['.js', '.ts'];

/** @type {import('rollup').RollupOptions} */
const app = {
    input: [
        'src/beautypanel.ts'
    ],
    output: {
        file: 'index.js',
        format: 'cjs'
    },
    plugins: [
        // Allows node_modules resolution
        resolve({
            mainFields: ['jsnext:main', 'module', 'main'],
            extensions: ['ts', 'tsx', '.mjs', '.js', 'jsx']
        }),
        // Bundle JSON files
        json({
            compact: true,
            exclude: [
                'node_modules',
            ],
            preferConst: true,
            namedExports: true
        }),
        // Stylesheets
        scss({
            output: 'index.css',
            includePaths: ['node_modules'],
            compiler: require('sass'),
            watch: 'src/styles'
        }),
        // Compile TypeScript/JavaScript files
        typescript(),
        // Combile jsx
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/env', '@babel/preset-react'],
            babelHelpers: 'runtime'
        }),
        // Convert cjs and umd modules to esm
        cjs({ extensions }),
    ]
}

export default [
    app
];