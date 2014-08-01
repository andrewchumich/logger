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

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $firebase, $firebaseSimpleLogin ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });


  $scope.loaded = false;

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
       $scope.error = error.toString();
    });
  };

  $scope.logOut = function () {
    $scope.auth.$logout();

  };

  $scope.$on('$firebaseSimpleLogin:login', function () {
      $location.path('/logHome/');
  });
  $scope.firebase = $firebase(new Firebase('https://runninglog.firebaseio.com'));
  $scope.firebase.$on('loaded', function () {
    $scope.loaded = true;
    //I'm not sure if the auth object will always return quickly upon instantiation
    //if it doesn not, we will need to wait for it. There should be a better way!
    while($scope.auth.user === null) {
      console.log("WAITING FOR USER");
    }
    $scope.type = $scope.firebase.users[$scope.auth.user.id].defaultLog;
    console.log("TYPE HERE: "+$scope.type);
  });

})

;

