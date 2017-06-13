import  path from 'path';
import webpack from 'webpack';

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/index.js')
  ],
  output: {
    path: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin,
    new webpack.optimize.OccurrenceOrderPlugin,
    new webpack.HotModuleReplacementPlugin
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: ['react-hot-loader', 'babel-loader'],
        exclude: /node_modules/,
        include: /client/
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
}