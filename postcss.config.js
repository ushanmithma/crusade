module.exports = {
	plugins: [
		require('autoprefixer'),
		require('cssnano')({
			preset: ['cssnano-preset-advanced', { discardComments: true }],
		}),
	],
}
