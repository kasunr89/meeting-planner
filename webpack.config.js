const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
	entry: {
		app: './src/index.jsx'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	devServer: {
		historyApiFallback: true,
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
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
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlWebPackPlugin({
			template: path.resolve( __dirname, 'public/index.ejs' ),
			filename: 'index.html',
			favicon: path.resolve( __dirname, 'public/favicon.ico' )
		})
	]
};