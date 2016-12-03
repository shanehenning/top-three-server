'use strict';

const querystring = require('querystring');
const request = require('request');
const oauthSignature = require('oauth-signature');
const OAuth = require('oauth');
const randomString = require('./random_string.js');

let authorize = {};

authorize.yelpCall = function(setParams, cb) {
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
    console.log('apiUrl: ', apiUrl);
    return cb(error, res, body);
  });
};

authorize.twitterCall = function(setParams, cb) {
  console.log('twitterCall');
  let oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    'auPBJN39ONffF7Ks1ratqjUrF',
    'GxmKT020fIluhfpD10jzTBVA2ha05yvtcbcYVvqleV5HwH7OU1',
    '1.0A',
    null,
    'HMAC-SHA1'
  );
  let url = 'https://api.twitter.com/1.1/search/tweets.json?';
  let apiUrl = url += querystring.stringify(setParams);
  console.log('apiUrl: ', apiUrl);

  oauth.get(
    apiUrl,
    '804173284635873280-SgmVsDaft3oHXESgTT4oIP9hxpgpV0R',
    'xuAk68LZGDLiR1avomHo8f0lL89a9Gryp8iuw86A1Z0qi',
    function(e, data, res) {
      // console.log(require('util').inspect(data));
      return cb(e,data,res);
    });
};

authorize.facebookCall = function(setParams, cb) {
  let searchUrl = 'https://graph.facebook.com/search?';
  let config = {
    AppID: '390234804652238',
    AppSecret: 'c01adc9b010ef9ffb152fc4b3cafc5bc',
  };
  let params = {
    q: setParams.q + ' ' + setParams.location,
    type: 'place',
    limit: 1,
    fields: 'name,menu,about,business,company_overview,description,general_info,single_line_address,username,website,hours,price_range,rating_count,talking_about_count,posts.limit(3){message,full_picture}',
  };
  let apiUrl = searchUrl += querystring.stringify(params) + '&access_token=' + config.AppID + '|' + config.AppSecret;
  request(apiUrl, function(error, res, body){
    console.log('facebook apiUrl: ', apiUrl);
    return cb(error, res, body);
  });
};

// authorize.instagramCall = function(setParams, cb){
//   let apiUrl = 'https://www.instagram.com/' + setParams.q + '/media/';
//   request(apiUrl, function(error, res,body){
//     console.log('instagram apiUrl: ', apiUrl);
//     return cb(error, res, body);
//   });
// };

module.exports = exports = authorize;
