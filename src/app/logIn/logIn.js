angular.module( 'ngBoilerplate.logIn', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logIn', {
    url: '/logIn',
    views: {
      "main": {
        controller: 'LogInCtrl',
        templateUrl: 'logIn/logIn.tpl.html'
      }
    },
    data:{ pageTitle: 'Log In' }
  });

})

.controller('LogInCtrl', function LogInCtrl( $scope, $firebase, $stateParams ){
	if($stateParams.type) {
    $scope.type = $stateParams.type;
  }
  $scope.logInData = {};
  // buttons will be disabled until user data is loaded



	

})

;