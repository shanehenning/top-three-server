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
    oauth_consumer_key: __YELP_OAUTH_CONSUMER_KEY__,
    oauth_token: __YELP_OAUTH_TOKEN__,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: new Date().getTime(),
    oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    oauth_version: '1.0',
  };
  let consumerSecret = __YELP_CONSUMER_SECRET__;
  let tokenSecret = __YELP_TOKEN_SECRET__;
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
    __TWITTER_CONSUMER_KEY__,
    __TWITTER_CONSUMER_SECRET__,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
  let url = 'https://api.twitter.com/1.1/search/tweets.json?';
  let apiUrl = url += querystring.stringify(setParams);

  oauth.get(
    apiUrl,
    __TWITTER_ACCESS_TOKEN__,
    __TWITTER_ACCESS_TOKEN_SECRET__,
    function(e, data, res) {
      return cb(e,data,res);
    });
};

authorize.facebookCall = function(setParams, cb) {
  let searchUrl = 'https://graph.facebook.com/search?';
  let config = {
    AppID: __FACEBOOK_APP_ID__,
    AppSecret: __FACEBOOK_APP_SECRET__,
  };
  let params = {
    q: setParams.q,
    type: 'place',
    limit: 1,
    fields: 'name,menu,about,business,company_overview,cover,picture,description,general_info,single_line_address,username,website,hours,price_range,rating_count,talking_about_count,posts.limit(3){message,full_picture,created_time,updated_time,permalink_url}',
  };
  let apiUrl = searchUrl += querystring.stringify(params) + '&access_token=' + config.AppID + '|' + config.AppSecret;
  request(apiUrl, function(error, res, body){
    return cb(error, res, body);
  });
};

module.exports = exports = authorize;
