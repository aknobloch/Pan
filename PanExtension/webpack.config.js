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
		{ from: "./src/background_services/bs_manage_domains.js", to: "out/bs_manage_domains.js" },
		{ from: "./src/background_services/bs_on_install.js", to: "out/bs_on_install.js"},
		{ from: "./src/background_services/bs_change_icon.js", to: "out/bs_change_icon.js"},

		{ from: "./src/popup_menu/popup.html", to: "out/popup.html" },
		{ from: "./src/popup_menu/popup_actions.js", to: "out/popup_actions.js"	},
		{ from: "./src/popup_menu/css/pan.css", to: "out/pan.css" },
		{ from: "./src/popup_menu/manage_domains.html", to: "out/manage_domains.html" },
		{ from: "./src/popup_menu/manage_domains.js", to: "out/manage_domains.js" },
		{ from: "./src/popup_menu/help_page.html", to: "out/help_page.html" },
		{ from: "./src/popup_menu/help_page.js", to: "out/help_page.js" },
		{ from: "./src/popup_menu/css/help_page.css", to: "out/help_page.css" },

		{ from: "./src/on_install_page.html", to: "out/on_install_page.html" }
		])
	],

	// The following is due to a WebPack error, documented here:
	// https://github.com/webpack-contrib/css-loader/issues/447
	node: {
	  fs: 'empty'
	}
};
