var express = require('express');
var bodyParser = require('body-parser');

var db = require('./config');
var session = require('express-session');

var Users = require('./collections/users');
var User = require('./models/user');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

app.use(session({
  secret: 'shhh, it\'s a secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('signin');
});

console.log('penguins are listening on 8000');

app.listen(8000);

module.exports = app;
