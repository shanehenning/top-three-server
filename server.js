'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const path = require('path');
const cors = require('cors');
const httpError = require('http-errors');
const errorHandler = require('./lib/error-handler');
mongoose.Promise = Promise;

const serverPort = process.env.PORT || 3000;
const mongoDatabase = process.env.MONGODB_URI || 'mongodb://localhost/testDB';

const yelpRouter = require('./routes/yelp_router.js');

mongoose.connect(mongoDatabase);

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});
app.use('/api/yelp', yelpRouter);

app.all('*', (req, res, next) => {
  next(httpError(404, 'route not registered'));
});

app.use(errorHandler);

module.exports = exports = app.listen(serverPort, () => console.log('Server running on ' + serverPort));