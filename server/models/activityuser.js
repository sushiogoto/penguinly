var db = require('../config');
var Activity = require('./activity');
var User = require('./user');

module.exports = db.model('ActivityUser', {

  tableName: 'activityusers',

  user: function () {
    return this.belongsTo('User');
  },
  activity: function () {
    return this.belongsTo('Activity');
  }
});