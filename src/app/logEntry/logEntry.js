angular.module( 'ngBoilerplate.logEntry', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap',
  'firebase'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logEntry', {
    url: '/logEntry',
    views: {
      "main": {
        controller: 'LogEntryCtrl',
        templateUrl: 'logEntry/logEntry.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });

})



.controller( 'LogEntryCtrl', function LogViewCtrl( $scope, $firebase, $stateParams ) {
  // This is simple a demo for UI Boostrap.

  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/running'));
  $scope.logTemplate = $firebase(new Firebase('runninglog.firebaseio.com/logs/running'));

})

.directive('acText', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/textInput.tpl.html'
  };
})


.directive('acDate', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/dateInput.tpl.html'
  };
})
.directive('acTime', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/timeInput.tpl.html'
  };
})
.directive('acNumber', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/numberInput.tpl.html'
  };
})

.directive('acEnum', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/enumInput.tpl.html'
  };
})



;
