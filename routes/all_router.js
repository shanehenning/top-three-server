'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const authorize = require('./authorize.js');
const moment = require('moment');

const allRouter = module.exports = exports = Router();

let returnObject = [{}, {}, {}];

allRouter.post('/', jsonParser, (req, res, next) => {
  authorize.yelpCall(req.body, function(error, response, body) {
    body = JSON.parse(body).businesses.sort(function(a, b) {
      return b.review_count - a.review_count;
    });
    returnObject.map(function(idx) {
      idx.yelp = body.splice(idx, 1)[0];

      let newImage = idx.yelp.image_url.slice(0, idx.yelp.image_url.length - 6);
      newImage += 'o.jpg';
      idx.yelp.image_url = newImage;
      if (idx.yelp.name.length > 30) {
        idx.yelp.name_truncated = idx.yelp.name.substr(0, 30);
      }
      var twitterParams = {
        q: idx.yelp.name + ' ' + idx.yelp.location.city + ' since:2014-01-01',
      };
      authorize.twitterCall(twitterParams, function(error, data, response) {
        // console.log('twitter data: ', JSON.parse(data).statuses.slice(0, 3));
        idx.twitter = JSON.parse(data).statuses.slice(0, 3);
        // console.log('idx.twitter: ', idx.twitter);
        // if (idx.twitter[0]) {
        //   idx.twitter.map(function(twitterDate) {
        //     twitterDate.created_at = moment(twitterDate.created_at).fromNow();
        //   });
        // }
      });

      var facebookParams = {
        q: idx.yelp.name,
        // location: idx.yelp.location.city,
      };
      authorize.facebookCall(facebookParams, function(error, response, body) {
        // console.log('facebook body: ', body);
        idx.facebook = JSON.parse(body).data[0];
        // if (idx.facebook.posts) {
        //   idx.facebook.posts.data.map(function(facebookDate) {
        //     facebookDate.created_time = moment(facebookDate.created_time).fromNow();
        //   });
        // }
        // if (idx.facebook.hours.mon_1_open) {
        //   let split;
        //   let suffix;
        //   for (var key in idx.facebook.hours) {
        //     if (idx.facebook.hours.hasOwnProperty(key)) {
        //       split = idx.facebook.hours[key].split(':');
        //       suffix = parseInt(split[0]) >= 12 ? ' pm' : ' am';
        //       idx.facebook.hours[key] = ((parseInt(split[0]) + 11) % 12 + 1).toString() + ':' + split[1] + suffix;
        //       if (idx.facebook.hours[key] === '12:00 pm') {
        //         idx.facebook.hours[key] = 'Noon';
        //       }
        //       if (idx.facebook.hours[key] === '12:00 am') {
        //         idx.facebook.hours[key] = 'Midnight';
        //       }
        //     }
        //   }
        // }
      });

      // var googleSearchParams = {
      //   q: idx.yelp.name,
      //   location: parseFloat(idx.yelp.location.coordinate.latitude).toFixed(3) + ',' + parseFloat(idx.yelp.location.coordinate.longitude).toFixed(3),
      // };
      // authorize.googlePlacesCall(googleSearchParams, function(error, response, body) {
      //   idx.google = JSON.parse(body).result;
      // });
    });
    console.log('returnObject: ', returnObject);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(returnObject);
  });
});

// allRouter.post('/', (req, res, next) => {
//   console.log('2nd');
// });
