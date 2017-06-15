import express from 'express';
import path from 'path';

// package to open broswer
import opn from 'opn';

// package to log error on console
import logger from 'morgan';

// package to get request body
import  bodyParser from 'body-parser';

// packages for client side 
import webpack from'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

// for webpack hot reload
import webpackHotMiddleware from 'webpack-hot-middleware'
// import the webpack config ftile
import webpackConfig from './webpack.config';

// create new express app
let app = express();

// create webpack compiler
const webpackCompiler = webpack(webpackConfig);

// use the webpack middleware in the server
app.use(webpackMiddleware(webpackCompiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotMiddleware(webpackCompiler));


// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
require('./server/routes')(app);

app.listen(1142, () => opn('http://localhost:1142'));