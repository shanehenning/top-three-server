'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authorize = require('./authorize.js');

const facebookRouter = module.exports = exports = Router();

facebookRouter.post('/', jsonParser, (req, res, next) => {
  console.log('req.body: ', req.body);
  authorize.facebookCall(req.body, function(error, response, body) {
    console.log('body: ', body);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
});

// https://graph.facebook.com/search?q=mamnoon&type=place&limit=1&access_token=390234804652238|c01adc9b010ef9ffb152fc4b3cafc5bc

// search?q=mamnoon&type=place&limit=1&fields=website,hours,price_range,rating_count,talking_about_count,posts.limit(3){message,full_picture}
