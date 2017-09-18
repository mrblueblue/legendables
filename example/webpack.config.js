var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: [
    path.resolve(__dirname, "index.js"),
    path.resolve(__dirname, "../src/styles.css")
  ],
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "assets"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader" ]
      }
    ]
  }
};
