angular.module( 'ngBoilerplate.logView', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap',
  'firebase'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logView', {
    url: '/logView/:year/:month/:day',
    views: {
      "main": {
        controller: 'LogViewCtrl',
        templateUrl: 'logView/logView.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });

})

.filter('dateFilter', function() {
  return function (objects, params, days_ahead) {
      var dateList = [];
      days_ahead = (typeof days_ahead === "undefined") ? 7 : days_ahead;
      console.log(days_ahead);
      if(objects != null) {
        for(var i = 0; i < objects.length; i++){
          var today = new Date(params.year, params.month - 1, params.day).getTime();
          var seven_days_ahead = today + days_ahead*24*60*60*1000;
          var date = [objects[i].metrics.date.substring(0,4),objects[i].metrics.date.substring(5,7),objects[i].metrics.date.substring(8,10)];
          var object_date = new Date(date[0], date[1]-1, date[2]).getTime();
          if (seven_days_ahead >= object_date && today <= object_date) {
            dateList.push(objects[i]);
          }
        }
      }
      return dateList;
  };
})

.controller( 'LogViewCtrl', function LogViewCtrl( $scope, $firebase, $stateParams ) {
  // This is simple a demo for UI Boostrap.
  $scope.params = $stateParams;
  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/'));
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
