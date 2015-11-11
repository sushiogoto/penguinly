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
      activityuser.integer('user_id').references('users.id');
      activityuser.integer('activity_id').references('activities.id');
    }).then(function (table) {
      console.log('Created ActivityUser Table', table);
    });
  }
});

db.knex.schema.hasTable('activities').then(function (exists) {
  if (!exists) {
    db.knex.schema.createTable('activities', function (activity) {
      activity.increments('id').primary();
      activity.string('title', 30);
      activity.string('description', 255);
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