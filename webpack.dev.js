const pathLib = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
// const config = require('./config/config');

const ROOT_PATH = pathLib.resolve(__dirname);
const ENTRY_PATH = pathLib.resolve(ROOT_PATH, 'app');
const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, 'build');
console.log(pathLib.resolve(ENTRY_PATH, 'index.js'));

module.exports = {
    entry: {
        index: [
            'react-hot-loader/patch',
            'babel-polyfill',
            pathLib.resolve(ENTRY_PATH, 'index.js')
        ],
        vendor: ['react', 'react-dom', 'react-router-dom']
    },
    output: {
        path: OUTPUT_PATH,
        publicPath: '/',
        filename: '[name]-[hash:8].js'
    },
    // devServer: {
    //     historyApiFallback: {
    //         index: 'build/index.html'
    //     }
    // },
    devtool: 'cheap-moudle-eval-source-map',
    module:{
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_mudules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                // exclude: /node_mudules/,
                use:['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', {loader: 'less-loader', options: {javascriptEnabled: true}}]
            },
            {
                test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
                exclude: /node_mudules/,
                use:[
                    {
                        loader: 'url-loader',
                        options:{
                            mimetype: 'image/png'
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
    plugins: [
        new CleanPlugin(['build']),
        new ProgressBarPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            title: "oyosc's Blog",
            showErrors: true,
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new OpenBrowserPlugin({
            url: 'http://127.0.0.1:3000'
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.less', 'jsx', '.css']
    }
}