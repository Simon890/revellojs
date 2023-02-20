const path = require("path");
module.exports = {
    entry: "./index.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname)]
            },
            {
                test: /\.html$/,
                use: "html-loader",
                include: [path.resolve(__dirname)]
            }
        ]
    },
    output: {
        publicPath: "",
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
}