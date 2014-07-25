angular.module( 'ngBoilerplate.logEntry', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap',
  'firebase'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logEntry', {
    url: '/logEntry/:type',
    views: {
      "main": {
        controller: 'LogEntryCtrl',
        templateUrl: 'logEntry/logEntry.tpl.html'
      }
    },
    data:{ pageTitle: 'Log Entry' }
  });

})


.controller( 'LogEntryCtrl', function LogViewCtrl( $scope, $firebase, $stateParams ) {
  // This is simple a demo for UI Boostrap.
  $scope.type = $stateParams.type;
  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/'+$scope.type));
  $scope.entries = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/'+$scope.type+'/entries'));
  $scope.logTemplate = $firebase(new Firebase('runninglog.firebaseio.com/logs/'+$scope.type));
  $scope.currentPage = "2";
  $scope.formData = {};
  $scope.formData.metrics = {};
  $scope.progress = false;
  $scope.addFormData = function (data) {
    $scope.entries.$add(data).then(function (ref) {
      $scope.progress = true;
    });
  };
  $scope.setEnumValue = function (metric, value) {
    $scope.formData.metrics[metric] = value;
  };
  $scope.setDateValue = function (metric, value) {
    var date = new Date(); 
    if(value === 'YESTERDAY'){
      date.setDate(date.getDate() - 1);
    }

    $scope.formData.metrics[metric] = date.getFullYear()+"-"+('0' + (date.getMonth()+1)).slice(-2)+"-"+('0' + date.getDate()).slice(-2);
  };

})
//Directive found at:http://stackoverflow.com/questions/15964278/angularjs-bind-ng-model-to-a-variable-which-name-is-stored-inside-another-vari
//allows ng-model to be set by a variable in ng-repeat
.directive('acBindModel',function($compile){
      return {
        link:function(scope,element,attr){
          element[0].removeAttribute('ac-bind-model');
          element[0].removeAttribute('ac-parent');
          element[0].setAttribute('ng-model',attr.acParent+"."+scope.$eval(attr.acBindModel));
          console.log("ELEMENT[0]: "+element[0]);
          $compile(element[0])(scope);
        }
      };
    })

.directive('acText', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/textInput.tpl.html'
  };
})
.directive('acTextarea', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/textareaInput.tpl.html'
  };
})
.directive('acDate', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/dateInput.tpl.html'
  };
})
.directive('acTime', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/timeInput.tpl.html'
  };
})
.directive('acNumber', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/numberInput.tpl.html'
  };
})
.directive('acEnum', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/enumInput.tpl.html'
  };
})
.directive('acBool', function() {
  return {
    restrict: 'E',
    templateUrl: 'logEntry/LogDirectives/boolInput.tpl.html'
  };
})



;
