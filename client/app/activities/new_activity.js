angular.module('penguinly.newActivity', [])
  .controller('NewActivityCtrl', function ($scope, $state, $stateParams, Activities) {
    $scope.activity = {};
    // need to set the group_id on activity for query later on
    $scope.activity.group_id = $stateParams.id;
    $scope.newActivity = function () {
      console.log($scope.activity);
      Activities.addActivity($scope.activity).then(function (data) {
        // $state.transitionTo("activities", {
        //    group_id: data.group_id
        // });
        $state.transitionTo("group", {
           id: $scope.activity.group_id
        });
      });
    };
  });
