angular.module('penguinly.groupPage', [])

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