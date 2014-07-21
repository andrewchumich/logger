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

//custom filter to return objects whose date attribute is within a certain range
.filter('dateFilter', function() {
  return function (objects, dateObject, days_ahead) {
      var dateList = [];
      console.log("IM IN HERE: "+objects);
      days_ahead = (typeof days_ahead === "undefined") ? 7 : days_ahead;

      if(objects != null && dateObject != null) {
        for(var i = 0; i < objects.length; i++){
          var today = dateObject.getTime() - 24*60*60*1000;
          var seven_days_ahead = today + (days_ahead - 1)*24*60*60*1000;
          var date = [objects[i].metrics.date.substring(0,4),objects[i].metrics.date.substring(5,7),objects[i].metrics.date.substring(8,10)];
          var object_date = new Date(date[0], date[1]-1, date[2]).getTime();
          console.log('SEVEN DAYS AHEAD: '+seven_days_ahead);
          console.log('Object Date: '+object_date);
          console.log('TODAY: '+today);
          
          if (seven_days_ahead >= object_date && today < object_date) {
            dateList.push(objects[i]);
          }
        }
      }
      return dateList;
  };
})

.controller( 'LogViewCtrl', function LogViewCtrl( $scope, $firebase, $stateParams ) {
  // This is simple a demo for UI Boostrap.
  $scope.log = $firebase(new Firebase('runninglog.firebaseio.com/users/12345/userLogs/running'));
  $scope.beginningOfWeek = new Date();
  $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getUTCDate() - $scope.beginningOfWeek.getUTCDay() + 1);
  $scope.changeDay = function(number) {
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getUTCDate() + number);
  };
  $scope.setDate = function(date) {
    console.log(date);
    if (date != null){
      $scope.beginningOfWeek = new Date(date);
      $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getUTCDate());
    }
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
      default:
        return 'ERROR: DAY NOT FOUND';
    }
  };
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
