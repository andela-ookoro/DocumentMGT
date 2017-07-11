import dotenv from 'dotenv';

import express from 'express';
import socketIO from 'socket.io';
// package to log error on console
import logger from 'morgan';
import path from 'path';

// package to get request body
import bodyParser from 'body-parser';

// import passport
import passport from 'passport';

// initiate dotenv
dotenv.config();



// packages for client side
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

// for webpack hot reload
import webpackHotMiddleware from 'webpack-hot-middleware';
// import the webpack config ftile
import webpackConfig from './webpack.config';
// create new express app
const app = express();

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
require('./server/routes')(app, express, path, passport);

// require passport
require('./server/config/passport')(passport);


const server = app.listen(1142, () => console.log("opn('htlocalhost:1142')"));
const ioObj = socketIO.listen(server, { log: false });
require('./server/config/socket')(ioObj);

export default app;
