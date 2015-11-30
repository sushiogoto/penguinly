var db = require('../config');
var Activity = require('../models/activity');

var Activities = new db.Collection();

Activities.model = Activity;

module.exports = db.collection('Activities', Activities);