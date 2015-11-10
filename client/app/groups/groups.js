angular.module('penguinly.groups', [])

.controller('GroupsCtrl', function ($scope, $location, $window, $state, Groups, Auth) {
  $scope.addGroup = function () {
    Groups.createGroup({
      name: $scope.groupName,
      user: $window.localStorage.getItem('currentUser')
    }).then(function (res) {
      // $scope.getGroup(res);
      console.log(res.data.id);
      $state.transitionTo("group", {
         id: res.data.id
      });

    });
    $scope.groupName = "";
  };

  $scope.joinGroup = function () {
    Groups.joinGroup({
      name: $scope.joinGroupName,
      user: $window.localStorage.getItem('currentUser')
    });
    $scope.joinGroupName = "";
  };

  $scope.signout = function () {
    Auth.signout();
  };

});