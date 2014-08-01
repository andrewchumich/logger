angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ui.bootstrap',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.logView',
  'ngBoilerplate.logEntry',
  'ngBoilerplate.logHome',
  'ngBoilerplate.logIn',
  'firebase',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $firebaseSimpleLogin ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });


  $scope.id = "CHODE";
  var ref = new Firebase('https://runninglog.firebaseio.com');
  $scope.auth = $firebaseSimpleLogin(ref);

  $scope.attemptLogIn = function (data) {
    
    $scope.auth.$login('password', {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe
    }).then(function(user) {
       console.log("Logged in as: ", user.uid);

    }, function(error) {
       console.error("Login failed: ", error);
    });
  };

  $scope.logOut = function () {
    $scope.auth.$logout();

  };

})

;

