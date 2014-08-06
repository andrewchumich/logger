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

  $scope.userSetup = function (user) {
    $scope.type = $scope.firebase.users[user.uid].defaultLog;
    $scope.loaded = true;
  };

  $scope.attemptLogIn = function (data) {
    
    $scope.auth.$login('password', {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe
    }).then(function(user) {
      $scope.userSetup(user);
      $location.path('/logHome/'+$scope.type);
       console.log("Logged in as: ", user.uid);

    }, function(error) {
       console.error("Login failed: ", error);
       $scope.error = error.toString();
    });
  };

  $scope.logOut = function () {
    $scope.auth.$logout();

  };


  $scope.firebase = $firebase(new Firebase('https://runninglog.firebaseio.com'));
  $scope.firebase.$on('loaded', function () {
    //I'm not sure if the auth object will always return quickly upon instantiation
    //there should be a way to wait for it?
    $scope.auth.$getCurrentUser().then(function (user) {
      console.log('USER: '+ user);
      if(user) {     
        $scope.userSetup(user);
      }
    $scope.log = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()+'/userLogs/'+$scope.type));
    $scope.entries = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()+'/userLogs/'+$scope.type+'/entries'));
    $scope.logTemplate = $firebase(new Firebase('https://runninglog.firebaseio.com/logs/'+$scope.type));
    $scope.log = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()+'/userLogs/'+$scope.type));

    });
  });

})

;

