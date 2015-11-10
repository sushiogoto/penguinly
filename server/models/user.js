// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');
// // var Activity = require('./activity');



// var User = db.Model.extend({

//   tableName: 'users',

// // !TODO: NEED TO REQUIRE THESE MODELS
//   activities: function () {
//     return this.belongsToMany(Activity)
//                .through(ActivityUser)
//                .withPivot(['voted']);
//   },
//   group: function () {
//     return this.belongsTo(Group);
//   },
// });

// var Activity = db.Model.extend({

//   tableName: 'activities',

//   users: function () {
//     return this.belongsToMany(User)
//                .through(ActivityUser)
//                .withPivot(['voted']);
//   },
//   group: function () {
//     return this.belongsTo(Group);
//   }
// });

// var ActivityUser = db.Model.extend( {

//   tableName: 'activityusers',

//   user: function () {
//     return this.belongsTo(User);
//   },
//   activity: function () {
//     return this.belongsTo(Activity);
//   }
// });

// var Group = db.Model.extend({

//   tableName: 'groups',

//   users: function () {
//     return this.hasMany(User);
//   },

//   activites: function () {
//     return this.hasMany(Activity);
//   }
// });

// module.exports = User;