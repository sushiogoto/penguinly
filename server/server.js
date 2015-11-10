var express = require('express');
var bodyParser = require('body-parser');
var util = require('../lib/utility');

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

// app.get('/', function (req, res) {
//   res.render('index');
// });

// app.get('/signin', function (req, res) {
//   res.render('signin');
// });

app.post('/signin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        // BASIC VERSION
        // bcrypt.compare(password, user.get('password'), function(err, match) {
        //   if (match) {
        //     util.createSession(req, res, user);
        //   } else {
        //     res.redirect('/signin');
        //   }
        // });
        // ADVANCED VERSION -- see user model
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/signin');
          }
        });
      }
  });
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username);
  console.log(password);

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        // BASIC VERSION
        // bcrypt.hash(password, null, null, function(err, hash) {
        //   Users.create({
        //     username: username,
        //     password: hash
        //   }).then(function(user) {
        //       util.createSession(req, res, user);
        //   });
        // });
        // ADVANCED VERSION -- see user model
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save()
          .then(function(newUser) {
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
});

console.log('penguins are listening on 8000');

app.listen(8000);

module.exports = app;
