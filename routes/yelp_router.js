'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authorize = require('./authorize.js');

const yelpRouter = module.exports = exports = Router();

yelpRouter.post('/', jsonParser, (req, res, next) => {
  console.log('req.body: ', req.body);
  authorize.yelpCall(req.body, function(e, r, b){
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(b);
  });
});
