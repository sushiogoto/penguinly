// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('penguinly.auth', ['ngAnimate'])

.controller('AuthCtrl', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.errorBool = false;

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.penguinly', data.token);
        $window.localStorage.setItem('currentUser', data.user);
        $window.localStorage.setItem('currentUserId', data.id);
        $location.path('/groups');
      })
      .catch(function (error) {
        $scope.errorBool = true;
        $scope.errorMessage = "Username or password incorrect";
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.penguinly', data.token);
        $window.localStorage.setItem('currentUser', data.user);
        $window.localStorage.setItem('currentUserId', data.id);
        $location.path('/groups');
      })
      .catch(function (error) {
        $scope.errorBool = true;
        $scope.errorMessage = "User already exists";
        console.error(error);
      });
  };
});
