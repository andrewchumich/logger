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
  })
  .state( 'logEntryEdit', {
    url: '/logEntry/:type/:id',
    views: {
      "main": {
        controller: 'LogEntryCtrl',
        templateUrl: 'logEntry/logEntry.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit Log Entry' }
  })
  .state( 'logEntryEditDate', {
    url: '/logEntry/:type/:id/:date',
    views: {
      "main": {
        controller: 'LogEntryCtrl',
        templateUrl: 'logEntry/logEntry.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit Log Entry' }
  });

})


.controller( 'LogEntryCtrl', function LogViewCtrl( $scope, $location, $firebase, $stateParams ) {
  $scope.formData = {};
  $scope.formData.metrics = {};
  $scope.type = $stateParams.type;
  $scope.redirect = {};
  $scope.redirect.date = $stateParams.date;
  $scope.id = $stateParams.id || undefined;
  if($scope.id) {
    if($scope.entries  === undefined || $scope.entries === null) {
      $scope.$on("EntriesLoaded", function(event, entries) {
        $scope.formData = entries[$scope.id];
        $scope.redirect.date = $scope.makeDate(entries[$scope.id].metrics.date).getTime();
      });
    } else {
        $scope.formData = $scope.entries[$scope.id];
        $scope.redirect.date = $scope.makeDate($scope.entries[$scope.id].metrics.date).getTime();
    }
  }

  //progress: is the form complete and has it been successfully added to firebase?
  $scope.progress = false;
  $scope.addFormData = function (data) {
    if(data.metrics.date !== undefined  && data.metrics.date !== null) {
      data.metrics.date = new Date(data.metrics.date);
      data.metrics.date = data.metrics.date.getTime();
      if ($scope.redirect.date) {
        $scope.entries[$scope.id] = data;
      } else {
        $scope.entries[data.metrics.date+"-"+Date.now().toString()] = data;
      }
      $scope.entries.$save().then(function (ref) {
        $scope.progress = true;
        $location.path('/logView/'+$scope.type+'/'+$scope.redirect.date);
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
    if($scope.formData.metrics[name] === null || $scope.formData.metrics[name] === undefined) {
      $scope.formData.metrics[name] = Number(difference);
    }
    else {
      $scope.formData.metrics[name] += Number(difference);
    }
  };
})

/*
acDynamicInput direcive allows custom input directives to
have access to models based on the acName, acTemplate, and acModel variables
acName: name of metric in logs.templateName.metrics table
acTemplate: js object containing the current template being used
  i.e. 'running' or 'fishing'
acModel: js object containing the model the data should bind to
  i.e. formData.metrics.timeOfDay
*/
.directive('acDynamicInput', function($log, $compile) {
    return {
        restrict: 'E',
        scope: {
            acName: '@',
            acTemplate: '=',
            acModel: '='
        },
        link: function(scope, element, attrs) {
            // decode acType down into the proper sub-directive
            var template = null;
            switch (scope.acTemplate.metrics[scope.acName].type) {
                case "text":
                    template = "<ac-text ac-name=\"acName\" ac-model=\"acModel\"></ac-text>";
                    break;
                case "textarea":
                    template = "<ac-textarea ac-name=\"acName\" ac-model=\"acModel\"></ac-textarea>";
                    break;
                case "date":
                    template = "<ac-date ac-name=\"acName\" ac-model=\"acModel\"></ac-date>";
                    break;
                case "time":
                    template = "<ac-time ac-name=\"acName\" ac-model=\"acModel\"></ac-time>";
                    break;
                case "number":
                    template = "<ac-number ac-name=\"acName\" ac-model=\"acModel\"></ac-number>";
                    break;
                case "enum":
                    template = "<ac-enum ac-name=\"acName\" ac-model=\"acModel\"></ac-enum>";
                    break;
                case "bool":
                    template = "<ac-bool ac-name=\"acName\" ac-model=\"acModel\"></ac-bool>";
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
