angular.module('penguinly.newActivity', ['ngMessages'])
  .controller('NewActivityCtrl', function ($scope, $state, $stateParams) {
    $scope.activity = {};
    $scope.newActivity = function () {
      console.log($scope.activity);
      debugger;
    };
  });
