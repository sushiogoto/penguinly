angular.module('penguinly.newActivity', [])
  .controller('NewActivityCtrl', function ($scope, $state, $stateParams, Activities) {
    $scope.activity = {};
    $scope.activity.group_id = $stateParams.id;
    $scope.newActivity = function () {
      console.log($scope.activity);
      Activities.addActivity($scope.activity);
    };
  });
