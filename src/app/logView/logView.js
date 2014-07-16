angular.module( 'ngBoilerplate.logView', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap',
  'firebase'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logView', {
    url: '/logView',
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
  return function (objects, dateObject, days_ahead) {
      var dateList = [];
      days_ahead = (typeof days_ahead === "undefined") ? 7 : days_ahead;
      console.log(dateObject);
      if(objects != null) {
        for(var i = 0; i < objects.length; i++){
          var today = dateObject.getTime();
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
  $scope.beginningOfWeek = new Date();
  $scope.changeDay = function(number) {
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate() + number);
  };
  $scope.getDayOfWeek = function() {
    switch($scope.beginningOfWeek.getDay()) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';        
      case 2:
        return 'Tuesday';        
      case 3:
        return 'Wednesday';        
      case 4:
        return 'Thursday';         
      case 5:
        return 'Friday';  
      case 6:
        return 'Saturday';
    }
  };
  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/'));
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
