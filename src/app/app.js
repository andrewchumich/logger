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
    $scope.firebase.users = {};
    $scope.firebase.users[user.uid.toString()] = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+user.uid.toString())).$asObject();
    $scope.firebase.users[user.uid.toString()].$loaded().then(function () {
    console.log("TOTES LOADED");
    $scope.type = $scope.firebase.users[user.uid].defaultLog;
    $scope.log = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()+'/userLogs/'+$scope.type)).$asObject();
    $scope.entries = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()+'/userLogs/'+$scope.type+'/entries')).$asObject();
    $scope.logTemplate = $firebase(new Firebase('https://runninglog.firebaseio.com/logs/'+$scope.type)).$asObject();
    $scope.loaded = true;
    });
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
    $scope.loaded = false;
  };

  $scope.firebase = {};
  $scope.firebase.logs = $firebase(new Firebase('https://runninglog.firebaseio.com/logs')).$asObject();
  $scope.firebase.logs.$loaded().then(function () {
    //I'm not sure if the auth object will always return quickly upon instantiation
    //there should be a way to wait for it?
    $scope.auth.$getCurrentUser().then(function (user) {
      console.log('USER: '+ user);
      if(user) {     
        $scope.userSetup(user);
      }


    });
  });

})

;

