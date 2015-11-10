angular.module('penguinly.activities', [])
  .controller('ActivitiesCtrl', function ($scope, $state, $stateParams, Activities) {
    $scope.data = {};
    $scope.group_id = $stateParams.group_id;

    $scope.fetchActivities = function () {
      Activities.getActivities($scope.group_id).then(function (data) {
        $scope.data.activities = data;
      });
    };

    $scope.fetchActivities();
    console.log($scope.data.activities);
  });