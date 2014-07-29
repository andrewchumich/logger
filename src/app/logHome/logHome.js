angular.module( 'ngBoilerplate.logHome', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logHome', {
    url: '/logHome/:type',
    views: {
      "main": {
        controller: 'LogHomeCtrl',
        templateUrl: 'logHome/logHome.tpl.html'
      }
    },
    data:{ pageTitle: 'Log Home' }
  });

})

.controller('LogHomeCtrl', function LogHomeCtrl( $scope, $firebase, $stateParams ){
	$scope.type = $stateParams.type;
	// buttons will be disabled until user data is loaded
	$scope.loaded = false;
	$scope.user = $firebase(new Firebase('runninglog.firebaseio.com/users/12345'));
	$scope.user.$on('loaded', function () {
		$scope.loaded = true;
		if($scope.type === "") {
			$scope.type = $scope.user.defaultLog;
		}
	});
	

})

;