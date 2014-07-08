angular.module( 'ngBoilerplate.logView', [
  'ui.router',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logView', {
    url: '/logView',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'logView/logView.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'LogViewCtrl', function LogViewCtrl( $scope, $firebase ) {
  // This is simple a demo for UI Boostrap.
  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs'));
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
