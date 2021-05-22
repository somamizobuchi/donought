const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
	mode: "development",
	output: {
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin()
	],
	devServer: {
		port: process.env.PORT || 4000,
		historyApiFallback: true,
		proxy: {
			'/api': 'http://localhost:5000'
		}
	}
})