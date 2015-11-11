angular.module('penguinly.activityPage', [])
  .controller('ActivityPageCtrl', function ($scope, $state, $stateParams, Activities) {
    $scope.data = {};
    $scope.activityId = $stateParams.id;
    $scope.fetchActivity = function () {
      Activities.getActivity($scope.activityId).then(function (data) {
        $scope.data.activity = data;
      });
    };

    // get all votes

    // vote button

    $scope.fetchActivity();
  });