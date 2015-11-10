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

})
.controller('GroupPageCtrl', function ($scope, $state, $stateParams, Groups) {
  $scope.data = {};

  // TODO!!!!! MOVE THIS INTO SERVICES
  $scope.getGroup = function (groupId) {
    Groups.getGroup(groupId).then(function (res) {
      $scope.data.group = res;
    });
  };

  $scope.getUsers = function (groupId) {
    Groups.getUsers(groupId).then(function (res) {
      $scope.data.users = res;
    });
  };

  $scope.getUsers($stateParams.id);
  $scope.getGroup($stateParams.id);
});