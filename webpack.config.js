const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';
const basePlugins = [
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    Hammer: 'hammerjs/hammer'
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin({
    filename: path.join(__dirname, 'public/style.css'),
    allChunks: true
  })
];
const debugPlugins = [new ExtractTextPlugin('style.css')];
const productionPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
  new ExtractTextPlugin({
    filename: path.join(__dirname, 'public/style.css'),
    allChunks: true
  }),
];

const plugins = debug ?
  debugPlugins.concat(basePlugins) : productionPlugins.concat(basePlugins);

module.exports = {
  context: __dirname,
  node: {
    fs: 'empty'
  },
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/index.js'),
    path.join(__dirname, 'client/style/main.scss')
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.min.js',
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: ['react-hot-loader', 'babel-loader'],
        exclude: /(node_modules|bower_components)/,
        include: /client/,
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /materialize-css\/bin\//,
        loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  },
  devtool: '#eval-source-map',
};

