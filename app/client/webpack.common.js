const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg|ico)$/i,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]'
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
			favicon: 'favicon-32x32.png'
		})
	]
}