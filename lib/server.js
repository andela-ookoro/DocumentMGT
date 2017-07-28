'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./server/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // integrate socket
// import socket from './server/config/socket';
// //socket(app);

// initiate dotenv

// package to get request body

// package to log error on console
_dotenv2.default.config();

// create new express app

// // packages for client side
// import webpack from 'webpack';
// import webpackMiddleware from 'webpack-dev-middleware';

// // for webpack hot reload
// import webpackHotMiddleware from 'webpack-hot-middleware';
// // import the webpack config ftile
// import webpackConfig from './webpack.config';

var app = (0, _express2.default)();
var router = _express2.default.Router();
// create webpack compiler
// const webpackCompiler = webpack(webpackConfig);

// use hemlet to disable settings that would leak security
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());
// // use the webpack middleware in the server
// app.use(webpackMiddleware(webpackCompiler, {
//   hot: true,
//   publicPath: webpackConfig.output.publicPath,
//   noInfo: true
// }));
// app.use(webpackHotMiddleware(webpackCompiler));


// Log requests to the console.
app.use((0, _morgan2.default)('dev'));

// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// serve static files in public folder
var publicPath = _path2.default.join(__dirname, 'public/');
app.use(_express2.default.static(publicPath));

// Require all routes into the application.
(0, _routes2.default)(router);

app.use('/api/v1', router);
// server compressed javascript file
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});
app.all('/', function (req, res) {
  return res.sendFile(publicPath + 'index.html');
});

// catch unknown routes
app.all('*', function (req, res) {
  return res.status(404).send({
    message: 'Route was not found.'
  });
});

// catch errors
app.use(function (err, req, res) {
  res.send(500, { message: err.message });
});

app.listen(process.env.PORT || 1142);
exports.default = app;