var Bookshelf = require('bookshelf');
var path = require('path');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'yo',
    database : 'penguinlydb',
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
      user.timestamps();
    }).then(function (table) {
      console.log('Created User Table', table);
    });
  }
});

module.exports = db;
