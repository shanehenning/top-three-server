'use strict';

const Router = require('express').Router;
// const jsonParser = require('body-parser').json();
const oauthSignature = require('oauth-signature');
const yelpRouter = Router();

module.exports = exports = function(){
  console.log('test');
  console.log(yelpRouter.get('/', (req, res, next) => {
    let method = 'GET';
    let url = 'http://api.yelp.com/v2/search';
    let params = {
      location:'Seattle', //req.body.location
      oauth_consumer_key: 'uRDu5MDX2XJ_WZpwi3DuGA',
      oauth_token: 'z898hXhCz10qZqGzXATw8ZjATHFuOUuG',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: new Date().getTime(),
      oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      term: 'food', //req.body.term
    };
    let consumerSecret = '1-EQsqk2MK10JTYBA4JoPDY87Ik';
    let tokenSecret = 'F2VqQ2ahPw2LxW8SvmtCBa9CrXY';
    let signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
    params['oauth_signaure'] = signature;
    next();
  }));
};

function randomString(length, useableCharacters){
  let result = '';
  for (var i = 0; i < length.length ; i++){
    result += useableCharacters[Math.round(Math.random() * useableCharacters.length - 1)];
  }
  return result;
}
// console.log(yelpRouter.post('/', jsonParser, (req, res, next) => {
//   let method = 'POST';
//   let url = 'http://api.yelp.com/v2/search';
//   let params = {
//     location:'Seattle', //req.body.location
//     oauth_consumer_key: 'uRDu5MDX2XJ_WZpwi3DuGA',
//     oauth_token: 'z898hXhCz10qZqGzXATw8ZjATHFuOUuG',
//     oauth_signature_method: 'HMAC-SHA1',
//     oauth_timestamp: new Date().getTime(),
//     oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
//     term: 'food', //req.body.term
//   };
//   let consumerSecret = '1-EQsqk2MK10JTYBA4JoPDY87Ik';
//   let tokenSecret = 'F2VqQ2ahPw2LxW8SvmtCBa9CrXY';
//   let signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
//   params['oauth_signaure'] = signature;
//   next();
// }));
