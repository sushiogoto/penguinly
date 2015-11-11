angular.module('penguinly.groupPage', [])

  .controller('GroupPageCtrl', function ($scope, $state, $stateParams, Groups, Activities) {
    $scope.data = {};
    $scope.groupId = $stateParams.id;

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

    $scope.fetchActivities = function () {
      Activities.getActivities($scope.groupId).then(function (data) {
        $scope.data.activities = data;
      });
    };

    $scope.signout = function () {
      Auth.signout();
    };

    $scope.fetchActivities();

    $scope.getUsers($scope.groupId);
    $scope.getGroup($scope.groupId);
  });