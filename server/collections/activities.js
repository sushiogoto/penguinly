var db = require('../config');
var User = require('../models/activity');

var Activities = new db.Collection();

Activities.model = Activity;

module.exports = Activities;