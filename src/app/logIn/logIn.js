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
	$scope.type = $stateParams.type;
  $scope.logInData = {};
  // buttons will be disabled until user data is loaded
  $scope.loaded = false;
  $scope.user = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.id.toString()));
  $scope.user.$on('loaded', function () {
    $scope.loaded = true;
    if($scope.type === "") {
      $scope.type = $scope.user.defaultLog;
    }
	});


	

})

;