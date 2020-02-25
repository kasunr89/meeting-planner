const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		app: './src/client/index.jsx'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	mode: 'development',
	target: 'web',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
				loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: ['url-loader']
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlWebPackPlugin({
			template: './public/index.ejs',
			filename: 'index.html',
			favicon: './public/favicon.ico'
		}),
		// new BundleAnalyzerPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
	]
};