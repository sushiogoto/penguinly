angular.module('penguinly.services', [])

.factory('Groups', function ($http) {
  var createGroup = function (group) {
    return $http({
      method: 'POST',
      url: '/groups',
      data: group
    })
    .then(function (res) {
      return res;
    });
  };

  var joinGroup = function (group) {
    return $http({
      method: 'PUT',
      url: '/api/group',
      data: group
    })
    .then(function (res) {
      return res;
    });
  };

  var getGroup = function (group) {
    return $http({
      method: 'GET',
      url: '/api/group/' + group
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getGroups = function () {
    return $http({
      method: 'GET',
      url: '/api/groups?userid=' + userId // get this from localStorage
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getUsers = function (groupId) {
    return $http({
      method: 'GET',
      url: '/api/users?id=' + groupId
    })
    .then(function (res) {
      return res.data[0].users;
    });
  };

  return {
    createGroup: createGroup,
    joinGroup: joinGroup,
    getGroup: getGroup,
    getUsers: getUsers
  };
})

.factory('Activities', function ($http, $location, $window) {
  var addActivity = function (activity) {
    return $http({
      method: 'POST',
      url: '/api/activities',
      data: activity
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getActivities = function (groupId) {
    console.log('GETTING');
    return $http({
      method: 'GET',
      url: '/api/activities?group_id=' + groupId
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getActivity = function (activityId) {
    return $http({
      method: 'GET',
      url: '/api/activity?activity_id=' + activityId
    })
    .then(function (res) {
      return res.data;
    });
  };

  var addVote = function (activityId) {
    return $http({
      method: 'PUT',
      url: '/api/activity',
      data: {
        userId: $window.localStorage.getItem('currentUserId'),
        activityId: activityId
      }
    })
    .then(function (res) {
      return res;
    });
  };

  return {
    addActivity: addActivity,
    getActivities: getActivities,
    getActivity: getActivity,
    addVote: addVote
  };
})

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.penguinly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.penguinly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.penguinly');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
