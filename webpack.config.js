const path = require("path");
const BUILD_DIR = path.resolve(__dirname, './public/build');
const APP_DIR = path.resolve(__dirname, './src');
var webpack = require('webpack');
const ci = require("ci-info");
const MODE = ci.isCI ? "production" : "development";
let config = async function () {
    return {
        mode: MODE,
        entry: {
            "servicebot-billing-settings-embed": [ APP_DIR + '/index.js'],


        },
        output: {
            path: BUILD_DIR,
            publicPath: "/build/",
            filename: '[name].js',
            library: ['Servicebot', "BillingSettings"],
            libraryTarget: 'umd',
            umdNamedDefine: true,

        },
        module : {
            rules: [
                {
                    test: /\.jsx?/,
                    include : [APP_DIR],
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS
                    ]
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            hot: true,
            contentBase: path.resolve(__dirname, 'public'),
            inline: true,
            host: 'localhost', // Defaults to `localhost`
            port: 3004
        },
        plugins : [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(MODE)
                }
            })

        ]
    }
};
module.exports = config;
