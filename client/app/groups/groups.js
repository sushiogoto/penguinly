angular.module('penguinly.groups', [])

.controller('GroupsCtrl', function ($scope, $location, Groups, Auth) {
  $scope.addGroup = function () {
    Groups.createGroup({ name: $scope.groupName });
    $scope.groupName = "";
  };

  $scope.signout = function () {
    Auth.signout();
  };

});