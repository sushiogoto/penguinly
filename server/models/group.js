var db = require('../config');
var Activity = require('./activity');
var ActivityUser = require('./activityuser');
var User = require('./user');
var UserGroup = require('./usergroup');

module.exports = db.model('Group', {

  tableName: 'groups',

  users: function () {
    return this.belongsToMany('User')
               .through(UserGroup);
  },

  activites: function () {
    return this.hasMany('Activity');
  }
});
