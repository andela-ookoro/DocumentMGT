import dotenv from 'dotenv';
import express from 'express';
// package to log error on console
import logger from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
// package to get request body
import bodyParser from 'body-parser';
// packages for client side
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

// for webpack hot reload
import webpackHotMiddleware from 'webpack-hot-middleware';
// import the webpack config ftile
import webpackConfig from './webpack.config';

import routes from './server/routes';

// integrate socket
import socket from './server/config/socket';
//socket(app);

// initiate dotenv
dotenv.config();

// create new express app
const app = express();
const router = express.Router();
// create webpack compiler
const webpackCompiler = webpack(webpackConfig);

// use hemlet to disable settings that would leak security
app.use(helmet());
app.use(compression());
// use the webpack middleware in the server
app.use(webpackMiddleware(webpackCompiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotMiddleware(webpackCompiler));


// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files in public folder
const publicPath = path.join(__dirname, 'public/');
app.use(express.static(publicPath));

// Require all routes into the application.
routes(router);

app.use('/api/v1', router);
// server compressed javascript file
app.get('*.js', (req, res, next) => {
  req.url = `${req.url}.gz`;
  res.set('Content-Encoding', 'gzip');
  next();
});
app.all('/', (req, res) =>
  res.sendFile(`${publicPath}index.html`)
);

// catch unknown routes
app.all('*', (req, res) => res.status(404).send({
  message: 'Route was not found.'
}));

// catch errors
app.use((err, req, res) => {
  res.send(500, { message: err.message })
});

app.listen(process.env.PORT || 1142);
export default app;
