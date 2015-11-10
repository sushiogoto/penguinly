var db = require('../config');
var Activity = require('./activity');
var Group = require('./group');
var User = require('./user');

var ActivityUser = db.Model.extend( {

  tableName: 'activityusers',

  user: function () {
    return this.belongsTo(User);
  },
  activity: function () {
    return this.belongsTo(Activity);
  }
});

module.exports = ActivityUser;