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
  if($stateParams.type){
    $scope.type = $stateParams.type;
  }
	// buttons will be disabled until user data is loaded
	


})

;