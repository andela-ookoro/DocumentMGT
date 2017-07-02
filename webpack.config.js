import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Dotenv from 'dotenv-webpack';


module.exports = {
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/index.js'),
    path.join(__dirname, 'client/style/main.scss')
  ],
  output: {
    path:  path.join(__dirname, 'public'),
    filename: 'bundle.min.js',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin,
    new webpack.optimize.OccurrenceOrderPlugin,
    new webpack.HotModuleReplacementPlugin,
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: true
    }),
  new ExtractTextPlugin({
    filename: path.join(__dirname, 'public/style.css'),
    allChunks: true
  }),
    new Dotenv({
      path: '.env',
      safe: true,
   })
  ],
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
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  }
}
