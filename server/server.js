var express = require('express');
var bodyParser = require('body-parser');
var util = require('../lib/utility');
var url = require('url');

var db = require('./config');
var session = require('express-session');

var Users = require('./collections/users');
var User = require('./models/user');

var Activity = require('./models/activity');
var ActivityUser = require('./models/activityuser');
var Group = require('./models/group');
var Groups = require('./collections/groups');
var app = express();

var morgan = require('morgan'); // used for logging incoming request
var helpers = require('./config/helpers.js'); // our custom middleware
var jwt = require('jwt-simple');

app.use(bodyParser.urlencoded({extended: true}));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
app.use(helpers.errorLogger);
app.use(helpers.errorHandler);

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


// !!!!TODO use checkauth function below

// var checkAuth = function (req, res, next) {
//   // checking to see if the user is authenticated
//   // grab the token in the header is any
//   // then decode the token, which we end up being the user object
//   // check to see if that user exists in the database
//   var token = req.headers['x-access-token'];
//   if (!token) {
//     next(new Error('No token'));
//   } else {
//     var user = jwt.decode(token, 'secret');
//     var findUser = Q.nbind(User.findOne, User);
//     findUser({username: user.username})
//       .then(function (foundUser) {
//         if (foundUser) {
//           res.send(200);
//         } else {
//           res.send(401);
//         }
//       })
//       .fail(function (error) {
//         next(error);
//       });
//   }
// };

app.post('/groups', function (req, res, next) {
  var groupName = req.body.name;
  var username = req.body.user;

  console.log(groupName);

  new User({ 'username': username })
    .fetch()
    .then(function (user) {
      new Group({ 'name': groupName })
        .fetch()
        .then(function (group) {
          if (!group) {
            var newGroup = new Group({
              'name': groupName
            });
            newGroup.save()
              .then(function (newGroup) {
                if (user.get('group_id') === null) {
                  user.set('group_id', newGroup.id);
                  user.save();
                }
                // TODO!! Redirect to that group's page
                // res.sendStatus(201);
                res.json({
                  name: newGroup.name,
                  id: newGroup.id
                });
              });
          } else {
            // TODO!!! Change these to redirects to group page
            res.sendStatus(404);
          }
      });
    });

});

app.get('/api/users', function (req, res, next) {
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var groupId = query.id;
  console.log(groupId);
  console.log("GOTTTTTTTTT");

  User
    .query('where', 'group_id', '=', groupId)
    .fetchAll({
      withRelated: ['group'],
      columns: ['id', 'username'],
      debug: true
    }).then(function (users) {
      res.json(users);
    }).catch(function (error) {
      console.error(error);
    });
});

app.get('/groups', function (req, res, next) {
  // new User().query({where: {group_id: groupId}}).then(function(users) {
  //    // postComments should now be a collection where each is loaded with related user & post
  //    console.log(JSON.stringify(users));
  // });

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var groupId = query.id;

  new Group({ 'id': groupId })
    .fetch()
    .then(function (group) {
      if (group) {
        res.json(group.attributes);
      } else {
        res.sendStatus(404);
      }
    });
});

// app.get('/groups/users', function (req, res, next) {
//   new Groups().fetch({withRelated: ['user', 'post']}).then(function(postComments) {
//      // postComments should now be a collection where each is loaded with related user & post
//      console.log(JSON.stringify(postComments));
//   });
// })

app.post('/groups/join', function (req, res, next) {
  var groupName = req.body.name;
  var username = req.body.user;

  console.log(groupName);

  new User({ 'username': username })
    .fetch()
    .then(function (user) {
      new Group({ 'name': groupName })
        .fetch()
        .then(function (group) {
          if (group) {
            user.set('group_id', group.id);
            user.save();
            // TODO!! Redirect to that group's page
            res.sendStatus(201);
          } else {
            // TODO!!! Change these to redirects to group page
            res.sendStatus(404);
          }
      });
    });

});

app.post('/signin', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function (user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        user.comparePassword(password, function (match) {
          if (match) {
            var token = jwt.encode(user, 'secret');
            res.json({
              token: token,
              user: user.attributes.username
            });
          } else {
            return next(new Error('No user'));
          }
        });
      }
  });
});

app.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username);
  console.log(password);

  new User({ username: username })
    .fetch()
    .then(function (user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save()
          .then(function (newUser) {
            var token = jwt.encode(user, 'secret');
            res.json({
              token: token,
              user: newUser.attributes.username
            });
          });
      } else {
        next(new Error('User already exist!'));
      }
    });
});

app.get('/logout', function (req, res, next) {
  req.session.destroy(function () {
    res.redirect('/signin');
  });
});

console.log('penguins are listening on 8000');

app.listen(8000);

module.exports = app;
