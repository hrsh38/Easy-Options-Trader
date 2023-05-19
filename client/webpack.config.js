const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  // Entry point that indicates where
  // should the webpack starts bundling
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // checks for .js or .jsx files
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.(css|scss)$/, //checks for .css files
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Options for resolving module requests
  // extensions that are used
  resolve: { extensions: ["*", ".js", ".jsx"] },

  // Output point is where webpack should
  // output the bundles and assets
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js",
  },
  plugins: [new NodePolyfillPlugin()],
}
// module.exports = {
//   entry: ["./src/index.js"],
//   output: {
//     path: __dirname,
//     filename: "./public/bundle.js",
//   },
//   devtool: "source-map",
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         loader: "babel-loader",
//         options: {
//           presets: ["@babel/preset-react"],
//         },
//       },
//       {
//         test: /\.css$/, //checks for .css files
//         use: ["style-loader", "css-loader"],
//       },
//     ],
//   },
// }
