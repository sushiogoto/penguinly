var express = require('express');
var bodyParser = require('body-parser');
var util = require('../lib/utility');
var url = require('url');

var db = require('./config');
var session = require('express-session');

var Users = require('./collections/users');
var User = require('./models/user');
var UserGroup = require('./models/usergroup');

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

app.post('/api/activities', function (req, res, next) {
  var newActivity = new Activity({
    'title': req.body.title,
    'date_time': req.body.datetime,
    'description': req.body.description,
    'group_id': req.body.group_id
  });
  var groupId = req.body.group_id;

  newActivity.save()
    .then(function (activity) {
      helpers.getUsers(groupId)
             .then(function (model) {
              // loop through all users who are part of group and create new activity user
              model.models[0].relations.users.forEach(function (user) {
                console.log(user);
                var newActivityUser = new ActivityUser({
                  user_id: user.id,
                  activity_id: activity.id
                });

                newActivityUser.save()
                  .then(function (activityUser) {
                    res.sendStatus(201);
                    console.log('new activityuser: ' + JSON.stringify(activityUser));
                  }).catch(function (error) {
                    console.log(error);
                  });
              });
          });
        }).catch(function (error) {
          console.error(error);
        });
});

app.get('/api/activities', function (req, res, next) {

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var groupId = query.group_id;

  Activity
    .query('where', 'group_id', '=', groupId)
    .fetchAll({
      withRelated: ['group'],
      columns: ['id', 'title'],
      debug: true
    }).then(function (activities) {
      res.json(activities);
    }).catch(function (error) {
      console.error(error);
    });
});

app.get('/api/activity', function (req, res, next) {

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var activityId = query.activity_id;

  new Activity({ 'id': activityId })
    .fetch()
    .then(function (activity) {
      res.json(activity);
    });
});

app.put('/api/activity', function (req, res, next) {

  var userId = req.body.userId;
  var activityId = req.body.activityId;

  ActivityUser
    .query('where', 'activity_id', '=', activityId)
    .fetchAll({
      // should refactor code to send a user_id instead of usename
      // need to add user_id to session
      columns: ['voted', 'user_id'],
      debug: true
    }).then(function (activityUsers) {
      var votes = 0;

      (function (countdown) {
        countdown = 0;
        activityUsers.models.forEach(function (activityUser) {
          console.log('uuuuuusseeeeeeeers: ' + JSON.stringify(activityUsers.models));
          console.log('voted: ' + activityUser.get('voted'));
          // TODO: SAVING INCORRECTLY - this code recreates a line...
          if (activityUser.get('voted') === null) {
            // parseInt because userId is a string
            if (activityUser.get('user_id') === parseInt(userId)) {
              activityUser.set({
                voted: true,
                id: userId
            });
              votes += 1;
              activityUser.save();
              }
          } else {
            console.log('voooooottiinnnnng braahhhhhh');
            votes += 1;
          }
          countdown += 1;
          if (countdown === activityUsers.models.length) {
            new Activity({ 'id': activityId })
                        .fetch()
                        .then(function (activity) {
                          activity.set('votes', votes);
                          activity.save();
                        });
            res.json(votes);
          }
        });
      })();
    }).catch(function (error) {
      console.error(error);
    });
});

app.post('/groups', function (req, res, next) {
  var groupName = req.body.name;
  var username = req.body.user;


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
                var newUserGroup = new UserGroup({
                  user_id: user.id,
                  group_id: newGroup.id
                });

                newUserGroup.save()
                  .then(function (userGroup) {
                    console.log('new userGroup: ' + userGroup);
                  }).catch(function (error) {
                    console.log(error);
                  });

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

  console.log('-------------------------------' + groupId);

  helpers.getUsers(groupId)
         .then(function (model) {
            res.json(model);
         });

});

// TODO: add this route after changing usergroups to be many to many relationship

// app.get('/api/groups', function (req, res, next) {
//   new Group({ ''})
// });

app.get('/api/group/:id', function (req, res, next) {

  new Group({ 'id': req.params.id })
    .fetch()
    .then(function (group) {
      if (group) {
        res.json(group.attributes);
      } else {
        res.sendStatus(404);
      }
    });
});

app.put('/api/group/', function (req, res, next) {
  var groupName = req.body.name;
  var username = req.body.user;


  new User({ 'username': username })
    .fetch()
    .then(function (user) {
      new Group({ 'name': groupName })
        .fetch()
        .then(function (group) {
          if (group) {
            var newUserGroup = new UserGroup({
              user_id: user.id,
              group_id: group.id
            });

            newUserGroup.save()
              .then(function (userGroup) {
                console.log('new userGroup: ' + userGroup);
              }).catch(function (error) {
                console.log(error);
              });
            // TODO!! Redirect to that group's page
            res.status(201).send(group.attributes);
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
              user: user.attributes.username,
              id: user.attributes.id
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
              user: newUser.attributes.username,
              id: newUser.attributes.id
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
