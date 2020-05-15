const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// npm run dev: compile and store file
// npm run start: doesn't store file, but it more like stream it

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: { // All the files in src will be bundled to dist
                    // src is only for development purposes
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({ // copying html file included js bundle file
            filename: 'index.html',
            template: './src/index.html' // starting html file
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // irregular expression, test all JS files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader' // loader in Webpack allows us to import or
                    // load all files, to process them. Like convert ES6 -> ES5
                }
            }
        ]
    }
};