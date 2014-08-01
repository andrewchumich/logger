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
	$scope.user = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.id.toString()));
	$scope.user.$on('loaded', function () {
    
		$scope.loaded = true;
		if($scope.type === "" || $scope.type === undefined || $scope.type === null) {
      $scope.type = $scope.user.defaultLog;
    }

	});

})

;