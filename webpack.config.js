

/** @type {import('webpack').Configuration} */
const config = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/beautypanel.ts',
    output: {
        filename: 'beautypanel.js',
        path: process.cwd() + '/ccx/js/',
    },
    externals: {
        photoshop: 'commonjs photoshop',
        uxp: 'commonjs uxp'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.tsx?$/, use: 'ts-loader' },
        ],
    },
};

export default config;