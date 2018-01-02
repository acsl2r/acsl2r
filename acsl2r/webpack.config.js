/// <binding AfterBuild='Run - Production' />
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    home: "./src/index.ts",
    acsl2rworker: "./src/component/acsl2rworker.ts"
  },

  output: {
    filename: "[name].min.js",
    path: __dirname + "/dist"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".tmpl"]
  },

  module: {
    rules: [
        {
          test: /\.tsx?$/,
          loader: "awesome-typescript-loader"
        },
        {
          test: /\.js$/,
          loader: "source-map-loader",
          enforce: "pre"
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader", use: "css-loader"
          })
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/, /grammar/],
          loader: 'babel-loader',
          options: { presets: ['es2015', { modules: false }] }
        },
        {
          test: /\.tmpl$/,
          exclude: [/node_modules/],
          use: 'raw-loader'
        }]
  },

  plugins: [
    new ExtractTextPlugin("bundle.min.css"),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ],

  externals: {
    "jquery": "jQuery"
  },

  node: {
    fs: "empty"
  }
};
