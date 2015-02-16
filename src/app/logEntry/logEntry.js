angular.module( 'ngBoilerplate.logEntry', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'

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


.controller( 'LogEntryCtrl', function LogViewCtrl( $scope, $location, $firebase, $stateParams ) {
  // This is simple a demo for UI Boostrap.
  $scope.type = $stateParams.type;
  $scope.currentPage = "2";
  $scope.formData = {};
  $scope.formData.metrics = {};
  //progress: is the form complete and has it been successfully added to firebase?
  $scope.progress = false;
  $scope.addFormData = function (data) {
    if(data.metrics.date !== undefined  && data.metrics.date != null) {
      $scope.entries[data.metrics.date+"-"+Date.now().toString()] = data;
      $scope.entries.$save().then(function (ref) {
        $scope.progress = true;
        $location.path('/logView/'+$scope.type);
      });
    }
    else {
      $scope.error = "You must enter a date!";
    }
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

  $scope.incrementNumberInput = function (name, difference) {
    console.log(name);
    if($scope.formData.metrics[name] + difference < 0){
      return;
    }
    if($scope.formData.metrics[name] == null || $scope.formData.metrics[name] === undefined) {
      $scope.formData.metrics[name] = Number(difference);
    }
    else {
      $scope.formData.metrics[name] += Number(difference);
    }
  };
})

.directive('acDynamicInput', function($log, $compile) {
    return {
        restrict: 'E',
        scope: {
            acName: '@',
            acType: '@',
            acModel: '='
        },
        link: function(scope, element, attrs) {
            // decode acType down into the proper sub-directive
            var template = null;
            console.log(element.html);
            switch (scope.acType) {
                case "number":
                    template = "<ac-number ac-name=\"acName\" ac-model=\"acModel\" ac-increment=\"acIncrement()\"></ac-number>";
                    break;
                case "text":
                    template = "<ac-text ac-name=\"acName\" ac-model=\"acModel\"></ac-text>";
                    break;
                default:
                    throw "acDynamicInput type not supported:" + scope.acType;
            }
            element.html(template);
            $compile(element.contents())(scope);
        }
    };
})

// .directive('acBindModel',function($compile){
//       return {
//         link:function(scope,element,attr){
//           element[0].removeAttribute('ac-bind-model');
//           element[0].removeAttribute('ac-parent');
//           element[0].setAttribute('ng-model',attr.acParent+"."+scope.$eval(attr.acBindModel));
//           console.log("ELEMENT[0]: "+element[0]);
//           $compile(element[0])(scope);
//         }
//       };
//     })

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
    scope: {
      acName: '=',
      acModel: '=',
      acIncrement: '&'
    },
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
