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

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
  $scope.loggedIn = false;
  var ref = new Firebase('https://runninglog.firebaseio.com');
  var auth = new FirebaseSimpleLogin(ref, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated to Firebase reference
    $scope.loggedIn = true;
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
  } else {
    console.log("IM HERE");
    // user is logged out
  }

  $scope.attemptLogIn = function (data) {
    
    auth.login('password', {
    email: data.email,
    password: data.password
    });
  };

  $scope.logOut = function () {
    auth.logout();
  };
});
})

;

