'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authorize = require('./authorize.js');

const twitterRouter = module.exports = exports = Router();

twitterRouter.post('/', jsonParser, (req, res, next) => {
  console.log('twitterRouter.post');
  console.log('req.body: ', req.body);
  authorize.twitterCall(req.body, function(error, data, response) {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});
