'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authorize = require('./authorize.js');

const instagramRouter = module.exports = exports = Router();

instagramRouter.post('/', jsonParser, (req, res, next) => {
  console.log('req.body: ', req.body);
  authorize.instagramCall(req.body, function(error, response, body) {
    console.log('body: ', body);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
});
