module.exports = {
	entry: "./app.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.(js|jsx)$/, loader: "jsx" }
		]
	}
};