angular.module('penguinly.navbar', [])

.controller('NavbarCtrl', function ($scope, Auth) {
  $scope.signout = function () {
    Auth.signout();
  };
});