angular.module('penguinly', [
    'penguinly.services',
    'penguinly.auth',
    'penguinly.groupPage',
    'penguinly.groups',
    'penguinly.navbar',
    'penguinly.newActivity',
    'penguinly.activities',
    'penguinly.activityPage',
    'ngRoute',
    'ngMaterial',
    'ui.router',
    'ngMessages',
    'scDateTime'
])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/groups');

  $stateProvider
    .state('navbar', {
      templateUrl: 'app/nav/navbar.html',
      controller: 'NavbarCtrl'
    })
    .state('groups', {
      url: '/groups',
      views: {
        '': {
          templateUrl: 'app/groups/groups.html',
          controller: 'GroupsCtrl'
        },
        'navbar@groups': {
          templateUrl: 'app/nav/navbar.html'
        }
      }
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthCtrl'
    })
    .state('group', {
      url: '/group/:id?newgroup',
      views: {
        '': {
          templateUrl: 'app/groups/group_page.html',
          controller: 'GroupPageCtrl'
        },
        'navbar@group': {
          templateUrl: 'app/nav/navbar.html'
        },
        'activities@group': {
          templateUrl: 'app/activities/activities.html',
          controller: 'GroupPageCtrl'
        }
      }
    })
    .state('newactivity', {
      url: '/activity/create?:id',
      views: {
        '': {
          templateUrl: 'app/activities/new_activity.html',
          controller: 'NewActivityCtrl'
        },
        'navbar@newactivity': {
          templateUrl: 'app/nav/navbar.html'
        }
      }
    })
    .state('activities', {
      url: '/group/:group_id/activities',
      views: {
        '': {
          templateUrl: 'app/activities/activities.html',
          controller: 'ActivitiesCtrl'
        },
        'navbar@activities': {
          templateUrl: 'app/nav/navbar.html'
        }
      }
    })
    .state('activity', {
      url: '/activity/id=:id&group_id=:group_id',
      views: {
        '': {
          templateUrl: 'app/activities/activity.html',
          controller: 'ActivityPageCtrl'
        },
        'navbar@activity': {
          templateUrl: 'app/nav/navbar.html'
        }
      }
    });
    // .state('signout', {
    //   url: '/signout',
    //   templateUrl: 'app/auth/signin.html'
    // });
    $httpProvider.interceptors.push('AttachTokens');
})
// .config(function ($routeProvider, $httpProvider) {
//   $routeProvider
//     .when('/signin', {
//       templateUrl: 'app/auth/signin.html',
//       controller: 'AuthController'
//     })
//     .when('/signup', {
//       templateUrl: 'app/auth/signup.html',
//       controller: 'AuthController'
//     })
//     .when('/groups', {
//       templateUrl: 'app/groups/groups.html',
//       controller: 'GroupsCtrl',
//       authenticate: true
//     })
//     .otherwise({
//       redirectTo: '/groups',
//       authenticate: true
//     });
//     $httpProvider.interceptors.push('AttachTokens');
// })
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.penguinly');
      console.log('jwt: ' + jwt);
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, $state, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup

  $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
    if (!Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});