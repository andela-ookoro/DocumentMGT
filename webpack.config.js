import  path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    // path.join(__dirname, 'client/index.js')
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
        include: '/client/'
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
    extensions: ['.js']
  }
}