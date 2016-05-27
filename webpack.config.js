var Promise = require('es6-promise').Promise; //To polyfill css-loader promise
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //To 

module.exports = {
  entry: {
    wfui:['./wfui-base.entry.js','./wfui-react.entry.js', './wfui-react-css.entry.js'],
    wfui_base: ['./wfui-base.entry.js'],
    wfui_react: ['./wfui-react.entry.js']
  },
  output: {
    path: './dist/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.js$/,
        exclode: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy' ],
          presets: ['react', 'es2015','stage-0']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new ExtractTextPlugin("wfui.bundle.css"),
  ]
}