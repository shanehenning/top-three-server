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
    oauth_consumer_key: __YELP_OAUTH_CONSUMER_KEY__ || 'uRDu5MDX2XJ_WZpwi3DuGA',
    oauth_token: __YELP_OAUTH_TOKEN__ || 'z898hXhCz10qZqGzXATw8ZjATHFuOUuG',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: new Date().getTime(),
    oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    oauth_version: '1.0',
  };
  let consumerSecret = __YELP_CONSUMER_SECRET__ || '1-EQsqk2MK10JTYBA4JoPDY87Ik';
  let tokenSecret = __YELP_TOKEN_SECRET__ || 'F2VqQ2ahPw2LxW8SvmtCBa9CrXY';
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
    __TWITTER_CONSUMER_KEY__ || 'auPBJN39ONffF7Ks1ratqjUrF',
    __TWITTER_CONSUMER_SECRET__ || 'GxmKT020fIluhfpD10jzTBVA2ha05yvtcbcYVvqleV5HwH7OU1',
    '1.0A',
    null,
    'HMAC-SHA1'
  );
  let url = 'https://api.twitter.com/1.1/search/tweets.json?';
  let apiUrl = url += querystring.stringify(setParams);

  oauth.get(
    apiUrl,
    __TWITTER_ACCESS_TOKEN__ || '804173284635873280-SgmVsDaft3oHXESgTT4oIP9hxpgpV0R',
    __TWITTER_ACCESS_TOKEN_SECRET__ || 'xuAk68LZGDLiR1avomHo8f0lL89a9Gryp8iuw86A1Z0qi',
    function(e, data, res) {
      return cb(e,data,res);
    });
};

authorize.facebookCall = function(setParams, cb) {
  let searchUrl = 'https://graph.facebook.com/search?';
  let config = {
    AppID: __FACEBOOK_APP_ID__ || '390234804652238',
    AppSecret: __FACEBOOK_APP_SECRET__ || 'c01adc9b010ef9ffb152fc4b3cafc5bc',
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
