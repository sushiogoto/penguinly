var jwt = require('jwt-simple');
var db = require('../config');
var Activity = require('../models/activity');
var ActivityUser = require('../models/activityuser');
var User = require('../models/user');
var UserGroup = require('../models/usergroup');
var Group = require('../models/group');

module.exports = {
  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js

    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {error: error.message});
  },

  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }

  },
  // helpers.js
  getUsers: function (groupId) {
    // return a certain Participant
    return new Group()
      // with a given participantId
      .query({where: {id: groupId}})
      // get the related event data
      // require: true will throw an error if the query fails
      .fetchAll({
        withRelated: ['users'],
        require: true,
        debug: true
      }).then(function (model) {
        return model;
      });
  }
};
