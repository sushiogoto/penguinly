var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Activity = require('./activity');
var ActivityUser = require('./activityuser');
var Group = require('./group');

var User = db.Model.extend({

  tableName: 'users',

// !TODO: NEED TO REQUIRE THESE MODELS
  activities: function () {
    return this.belongsToMany(Activity)
               .through(ActivityUser)
               .withPivot(['voted']);
  },
  group: function () {
    return this.belongsTo(Group);
  },
  initialize: function () {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function (attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function (err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function () {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function (hash) {
        this.set('password', hash);
      });
  }
});

module.exports = User;