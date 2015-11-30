var db = require('../config');
var ActivityUser = require('./activityuser');
var Group = require('./group');
var User = require('./user');

module.exports = db.model('Activity', {

  tableName: 'activities',

  users: function () {
    return this.belongsToMany(User)
               .through(ActivityUser)
               .withPivot(['voted']);
  },
  group: function () {
    return this.belongsTo(Group);
  }
});