angular.module('penguinly.groups', [])

.controller('GroupsCtrl', function ($scope, $location, $window, $state, $mdDialog, Groups, Auth) {

  $scope.status = '  ';

  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
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

});


function DialogController($scope, $mdDialog, $window, $state, Groups) {

  $scope.addGroup = function () {
    Groups.createGroup({
      name: $scope.groupName,
      user: $window.localStorage.getItem('currentUser')
    }).then(function (res) {
      // $scope.getGroup(res);
      console.log(res.data.id);
      $mdDialog.cancel();
      $state.transitionTo("group", {
         id: res.data.id,
         newgroup: true
      });

    });
    $scope.groupName = "";
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $scope.addGroup();
  };
}