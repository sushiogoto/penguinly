var db = require('../config');
var Activity = require('./activity');
var ActivityUser = require('./activityuser');
var User = require('./user');

var Group = db.Model.extend({

  tableName: 'groups',

  users: function () {
    return this.hasMany(User);
  },

  activites: function () {
    return this.hasMany(Activity);
  }
});

module.exports = Group;
