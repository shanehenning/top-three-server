'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const cors = require('cors');
const httpError = require('http-errors');
const errorHandler = require('./lib/error-handler');
mongoose.Promise = Promise;

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/testDB';

const yelpRouter = require('./routes/yelp_router.js');
const twitterRouter = require('./routes/twitter_router.js');
const facebookRouter = require('./routes/facebook_router.js');
const allRouter = require('./routes/all_router.js');

mongoose.connect(mongoDatabase);

app.use(cors());

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With', 'Content-Type', 'Accept');
  next();
});

app.use('/api/yelp', yelpRouter);
app.use('/api/twitter', twitterRouter);
app.use('/api/facebook', facebookRouter);
app.use('/api/all', allRouter);

app.all('*', (req, res, next) => {
  next(httpError(404, 'route not registered'));
});

app.use(errorHandler);

module.exports = exports = app.listen(serverPort, () => console.log('Server running on ' + serverPort));
