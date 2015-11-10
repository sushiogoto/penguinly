var Bookshelf = require('bookshelf');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'yoshiogoto',
    password : 'yo',
    database : 'penguinly',
    charset : 'utf8'
  }
});

var db = require('bookshelf')(knex);

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
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});

var Activity = db.Model.extend({

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

var ActivityUser = db.Model.extend( {

  tableName: 'activityusers',

  user: function () {
    return this.belongsTo(User);
  },
  activity: function () {
    return this.belongsTo(Activity);
  }
});

var Group = db.Model.extend({

  tableName: 'groups',

  users: function () {
    return this.hasMany(User);
  },

  activites: function () {
    return this.hasMany(Activity);
  }
});

db.knex.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 255);
      user.string('password', 255);
      user.integer('group_id').references('groups.id');
      user.timestamps();
    }).then(function (table) {
      console.log('Created User Table', table);
    });
  }
});

db.knex.schema.hasTable('activityusers').then(function (exists) {
  if (!exists) {
    db.knex.schema.createTable('activityusers', function (activityuser) {
      activityuser.increments('id').primary();
      activityuser.boolean('voted');
      activityuser.integer('user_id').references('activities.id');
      activityuser.integer('activity_id').references('users.id');
    }).then(function (table) {
      console.log('Created ActivityUser Table', table);
    });
  }
});

db.knex.schema.hasTable('activities').then(function (exists) {
  if (!exists) {
    db.knex.schema.createTable('activities', function (activity) {
      activity.increments('id').primary();
      activity.string('title', 255);
      activity.integer('group_id').references('groups.id');
      activity.dateTime('date_time');
    }).then(function (table) {
      console.log('Created Activity Table', table);
    });
  }
});

db.knex.schema.hasTable('groups').then(function (exists) {
  if (!exists) {
    db.knex.schema.createTable('groups', function (group) {
      group.increments('id').primary();
      group.string('name', 255);
    }).then(function (table) {
      console.log('Created Group Table', table);
    });
  }
});

module.exports = db;