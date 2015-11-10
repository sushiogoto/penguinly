angular.module('penguinly.newActivity', [])
  .controller('NewActivityCtrl', function ($scope, $state, $stateParams, Activities) {
    $scope.activity = {};
    $scope.group_id = $stateParams.id;
    $scope.newActivity = function () {
      console.log($scope.activity);
      Activities.addActivity($scope.activity).then(function (data) {
        // $state.transitionTo("activities", {
        //    group_id: data.group_id
        // });
        $state.transitionTo("group", {
           id: data.group_id
        });
      });
    };
  });
