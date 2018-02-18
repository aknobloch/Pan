const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
	plugins: [
		new CopyWebpackPlugin([
		{
			from: "./src/background_service.js", to: "out/background_service.js"	
		},
		{
			from: "./src/popup_menu/popup.html", to: "out/popup.html"
		},
		{
			from: "./src/popup_menu/popup_actions.js", to: "out/popup_actions.js"	
		},
		{
			from: "./src/popup_menu/css/pan.css", to: "out/pan.css"	
		}
		])
	],

	// The following is due to a WebPack error, documented here:
	// https://github.com/webpack-contrib/css-loader/issues/447
	node: {
	  fs: 'empty'
	}
};
