const path = require("path");

module.exports = {
    entry: {
        source: "./src/process_page.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "out/app.js"
    },
    resolve: {
		extensions: [ '.js', '.json', '*' ],
		modules: [ path.join(__dirname, 'node_modules') ],
	},

	// The following is due to a WebPack error, documented here:
	// https://github.com/webpack-contrib/css-loader/issues/447
	node: {
	  fs: 'empty'
	}
};
