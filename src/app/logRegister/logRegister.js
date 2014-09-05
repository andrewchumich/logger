angular.module( 'ngBoilerplate.logRegister', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logRegister', {
    url: '/logRegister',
    views: {
      "main": {
        controller: 'LogRegisterCtrl',
        templateUrl: 'logRegister/logRegister.tpl.html'
      }
    },
    data:{ pageTitle: 'Register for Logger' }
  });

})

.controller('LogRegisterCtrl', function LogRegisterCtrl( $scope, $firebase, $location, $stateParams ){
	
  $scope.firstTimeSetup = function (user) {
    console.log("NEW USER ID: "+$scope.auth.user.uid.toString());
    var userLogRef = $firebase(new Firebase('https://runninglog.firebaseio.com/users/'+$scope.auth.user.uid.toString()));
    var userLog = userLogRef.$asObject();
    userLog.$loaded().then(function () {
      userLogRef.$set('defaultLog', 'running').then(function () {
          $scope.userSetup(user);
          $location.path('/logHome/'+$scope.type);
          console.log("Logged in as: ", user.uid);
      });
    });

  };

  $scope.createUser = function (data) {
    if(data.password === data.password2) {
      $scope.auth.$createUser(data.email, data.password).then(function() {
          $scope.auth.$login('password', {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe
            }).then(function(user) {
              $scope.error = "";
              $scope.firstTimeSetup(user);


            }, function(error) {
               console.error("Login failed: ", error);
               $scope.error = error.toString();
          });
      });
    }else {
      $scope.error = "Passwords do not match";
    }

  };

})

;