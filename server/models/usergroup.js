var db = require('../config');
var User = require('./user');
var Group = require('./group');

module.exports = db.model('UserGroup', {

  tableName: 'usergroups',

  user: function () {
    return this.belongsTo('User');
  },
  group: function () {
    return this.belongsTo('Group');
  }
});