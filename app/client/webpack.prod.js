const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
	mode: "production",
	output: {
		filename: '[name].[hash]..js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style/[name].[hash].css'
		}),
		new CleanWebpackPlugin()
	]
})