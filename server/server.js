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
              // console.log('----------------------------------------123');
              // console.log(model.models[0].relations.users);
              // console.log('----------------------------------------1234');
              // console.log(JSON.stringify(model.models[0].users));
              // console.log('----------------------------------------12345');
              // console.log(model.models[0].attributes);
              // console.log('----------------------------------------123456');
              // console.log(model.attributes);
          // users.forEach(function (user) {
            // var newActivityUser = new ActivityUser({
            //   user_id: user.id,
            //   activity_id: activity.id
            // });

            // newActivityUser.save()
            //   .then(function (activityUser) {
            //     console.log('new activityuser: ' + activityUser);
            //   }).catch(function (error) {
            //     console.log(error);
            //   });
          });
          // res.json(users);
        }).catch(function (error) {
          console.error(error);
        });
      // loop through all users who are part of group and create new activity user


      // ************TO DO REMEMBER TO SEND THE CORRECT RES!!!!
    // res.json(activity);
});

app.get('/api/activities', function (req, res, next) {
  // new User().query({where: {group_id: groupId}}).then(function(users) {
  //    // postComments should now be a collection where each is loaded with related user & post
  //    console.log(JSON.stringify(users));
  // });

  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  var groupId = query.group_id;

  // ActivityUser
  //   .query('where', 'group_id', '=', groupId)
  //   .fetchAll({
  //     withRelated: ['group'],
  //     columns: ['id', 'title'],
  //     debug: true
  //   }).then(function (activities) {
  //     res.json(activities);
  //   }).catch(function (error) {
  //     console.error(error);
  //   });
  //   // .then(function (group) {
  //   //   if (group) {
  //   //     res.json(group.attributes);
  //   //   } else {
  //   //     res.sendStatus(404);
  //   //   }
  //   // });

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
  // new User().query({where: {group_id: groupId}}).then(function(users) {
  //    // postComments should now be a collection where each is loaded with related user & post
  //    console.log(JSON.stringify(users));
  // });

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
  // new User().query({where: {group_id: groupId}}).then(function(users) {
  //    // postComments should now be a collection where each is loaded with related user & post
  //    console.log(JSON.stringify(users));
  // });
  var username = req.body.username;
  var activityId = req.body.activityId;
  console.log(activityId);

  ActivityUser
    .query('where', 'activity_id', '=', activityId)
    .fetchAll({
      // should refactor code to send a user_id instead of usename
      // need to add user_id to session
      columns: ['voted', 'user_id'],
      debug: true
    }).then(function (activityUsers) {
      new User({ 'username': username })
        .fetch()
        .then(function (user) {
          var votes = 0;
          console.log('===============================');
          // console.log('MODELS' + Array.isArray(activityUsers["models"]));

          (function (countdown) {
            countdown = 0;
            activityUsers.models.forEach(function (activityUser) {
              if (activityUser.get('voted') === null) {
                  // console.log(user.id);
                if (activityUser.get('user_id') === user.id) {
                  activityUser.set('voted', true);
                  votes += 1;
                  activityUser.save();
                  }
              } else {
                votes += 1;
              }
              // console.log(votes);
              countdown += 1;
              if (countdown === activityUsers.models.length) {
                console.log(votes);
                res.json(votes);
              }
            });
          })();
          // for(var key in activityUsers) {
          //   (function(key) {
          //   console.log(activityUsers[key]);
          //   console.log('key: ' + key);
          //   if (activityUsers[key].voted === null) {
          //     if (activityUsers[key].user_id === user.id) {
          //       activityUsers[key].set('voted', true);
          //       votes += 1;
          //       activityUsers[key].save();
          //       }
          //   } else {
          //     votes += 1;
          //   }
          //   console.log(votes);
          //   })(key);
          // }
          // activityUsers.forEach(function (activityUser) {
          // });
        });
    }).catch(function (error) {
      console.error(error);
    });
    // .then(function (group) {
    //   if (group) {
    //     res.json(group.attributes);
    //   } else {
    //     res.sendStatus(404);
    //   }
    // });
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
  // UserGroup
  //   .query('where', 'group_id', '=', groupId)
  //   .fetchAll({
  //     columns: ['user_id'],
  //     debug: true
  //   }).then(function (userGroups) {

  //     console.log(JSON.stringify(userGroups));
  //     res.json(userGroups);
  //   }).catch(function (error) {
  //     console.error(error);
  //   });
});

// TODO: add this route after changing usergroups to be many to many relationship

// app.get('/api/groups', function (req, res, next) {
//   new Group({ ''})
// });

app.get('/api/group/:id', function (req, res, next) {
  // new User().query({where: {group_id: groupId}}).then(function(users) {
  //    // postComments should now be a collection where each is loaded with related user & post
  //    console.log(JSON.stringify(users));
  // });

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

// app.get('/groups/users', function (req, res, next) {
//   new Groups().fetch({withRelated: ['user', 'post']}).then(function(postComments) {
//      // postComments should now be a collection where each is loaded with related user & post
//      console.log(JSON.stringify(postComments));
//   });
// })

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
