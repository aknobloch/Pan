const path = require("path");

module.exports = {
    entry: {
        source: "./src/process_page.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "out/app.js"
    }
};
