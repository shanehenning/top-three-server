'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const oauthSignature = require('oauth-signature');
const request = require('request');
const querystring = require('querystring');

const yelpRouter = module.exports = exports = Router();

function randomString(length, useableCharacters) {
  let result = '';
  for (var i = 0; i < length.length; i++) {
    result += useableCharacters[Math.round(Math.random() * useableCharacters.length - 1)];
  }
  return result;
}

let yelpCall = function(setParams, cb) {
  console.log('setParams: ', setParams);
  let method = 'GET';
  let url = 'http://api.yelp.com/v2/search/?';
  let params = {
    location: setParams.location,
    term: setParams.term,
    radius_filter: '8046',
    oauth_consumer_key: process.env.oauth_consumer_key || 'uRDu5MDX2XJ_WZpwi3DuGA',
    oauth_token: process.env.oauth_token || 'z898hXhCz10qZqGzXATw8ZjATHFuOUuG',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: new Date().getTime(),
    oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    oauth_version: '1.0',
  };
  let consumerSecret = process.env.consumerSecret || '1-EQsqk2MK10JTYBA4JoPDY87Ik';
  let tokenSecret = process.env.tokenSecret || 'F2VqQ2ahPw2LxW8SvmtCBa9CrXY';
  let signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
  params['oauth_signature'] = signature;
  let paramsUrl = querystring.stringify(params);
  let apiUrl = url += paramsUrl;
  request(apiUrl, function(error, res, body) {
    return cb(error, res, body);
  });
};

yelpRouter.post('/', jsonParser, (req, res, next) => {
  console.log('req.body: ', req.body);
  yelpCall(req.body, function(e, r, b){
    if(b) console.log(b);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(b);
  });
});
