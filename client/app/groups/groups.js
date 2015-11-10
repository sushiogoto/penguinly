angular.module('penguinly.groups', [])

.controller('GroupsCtrl', function ($scope, $location, $window, Groups, Auth) {
  $scope.addGroup = function () {
    Groups.createGroup({
      name: $scope.groupName,
      user: $window.localStorage.getItem('currentUser')
    });
    $scope.groupName = "";
  };

  $scope.signout = function () {
    Auth.signout();
  };

});