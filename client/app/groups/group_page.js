angular.module('penguinly.groupPage', [])

  .controller('GroupPageCtrl', function ($scope, $state, $stateParams, $mdToast, $document, Groups, Activities) {
    $scope.data = {};
    $scope.groupId = $stateParams.id;

    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function () {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition () {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.showSimpleToast = function () {
      $mdToast.show(
        $mdToast.simple()
          .content('Group created!')
          .position($scope.getToastPosition())
          .hideDelay(3000)
      );
    };

    $scope.init = function () {
      if ($stateParams.newgroup) {
        $scope.showSimpleToast();
      }
    };

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

    $scope.randomColor = function () {
      var random = function () {
        return Math.floor(Math.random() * 256);
      };
      var rgba = 'rgba(' + random() + ',' + random() + ',' + random() + ',' + random() + ')';
      console.log(rgba);
      return rgba;
    };

    // this.data.activities.tiles = buildGridModel({
    //             icon : "avatar:svg-",
    //             title: "Svg-",
    //             background: ""
    //           });
    //     function buildGridModel(tileTmpl){
    //       var it, results = [ ];
    //       for (var j=0; j<11; j++) {
    //         it = angular.extend({},tileTmpl);
    //         it.icon  = it.icon + (j+1);
    //         it.title = it.title + (j+1);
    //         it.span  = { row : 1, col : 1 };
    //         switch(j+1) {
    //           case 1:
    //             it.background = "red";
    //             it.span.row = it.span.col = 2;
    //             break;
    //           case 2: it.background = "green";         break;
    //           case 3: it.background = "darkBlue";      break;
    //           case 4:
    //             it.background = "blue";
    //             it.span.col = 2;
    //             break;
    //           case 5:
    //             it.background = "yellow";
    //             it.span.row = it.span.col = 2;
    //             break;
    //           case 6: it.background = "pink";          break;
    //           case 7: it.background = "darkBlue";      break;
    //           case 8: it.background = "purple";        break;
    //           case 9: it.background = "deepBlue";      break;
    //           case 10: it.background = "lightPurple";  break;
    //           case 11: it.background = "yellow";       break;
    //         }
    //         results.push(it);
    //       }
    //       return results;
    //     }


    $scope.fetchActivities();
    $scope.init();
    $scope.getUsers($scope.groupId);
    $scope.getGroup($scope.groupId);
  });