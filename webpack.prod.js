const pathLib = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const ROOT_PATH = pathLib.resolve(__dirname)
const ENTRY_PATH = pathLib.resolve(ROOT_PATH, 'app')
const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, 'build')
console.log(pathLib.resolve(ENTRY_PATH, 'index.js'))

module.exports = {
    entry: {
        index: ['babel-polyfill', pathLib.resolve(ENTRY_PATH, 'index.js')],
        vendor: ['react', 'react-dom', 'react-router-dom']
    },
    output: {
        path: OUTPUT_PATH,
        publicPath: '/',
        filename: '[name]-[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.less$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'postcss-loader'}, {loader: 'less-loader', options: {javascriptEnabled: true}}]
            },
            {
                test: /\.css$/,
                // exclude: /node_mudules/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            }
        ]
    },
    // optimization: {
    //     splitChunks: {
    //       cacheGroups: {
    //         styles: {
    //           name: 'styles',
    //           test: /\.css$/,
    //           chunks: 'all',
    //           enforce: true
    //         }
    //       }
    //     }
    // },
    plugins: [
        new CleanPlugin(['build']),
        new ProgressBarPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('production'),
            'progress.env.API_URL': JSON.stringify('http://http://35.200.32.99:3030')
        }),
        new HtmlWebpackPlugin({
            title: "oyosc's blog",
            showErrors: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx']
    }
}
