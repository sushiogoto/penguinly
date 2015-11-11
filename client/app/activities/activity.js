angular.module('penguinly.activityPage', [])
  .controller('ActivityPageCtrl', function ($scope, $state, $window, $stateParams, Activities) {
    $scope.data = {};
    $scope.activityId = $stateParams.id;
    $scope.fetchActivity = function () {
      Activities.getActivity($scope.activityId).then(function (data) {
        $scope.data.activity = data;
      });
    };

    $scope.signout = function () {
      Auth.signout();
    };

    // get all votes

    // vote button
    $scope.sendVote = function () {
      Activities.addVote($window.localStorage.getItem('currentUser'), $scope.activityId)
        .then(function (data) {
          $scope.data.votes = data.data;
        });
    };

    $scope.fetchActivity();
  });