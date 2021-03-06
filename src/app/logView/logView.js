angular.module( 'ngBoilerplate.logView', [
  'ui.router',
  //'placeholders',
  'ui.bootstrap'

])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'logView', {
    url: '/logView/:type',
    views: {
      "main": {
        controller: 'LogViewCtrl',
        templateUrl: 'logView/logView.tpl.html'
      }
    },
    data:{ pageTitle: 'Log View' }
  });

})



//custom filter to return objects whose date attribute is within a certain range
.filter('dateFilter', function() {
  return function (entries, firstDay, days_ahead) {
      var dateList = [];
      console.log(entries, firstDay, days_ahead);
      days_ahead = (typeof days_ahead === "undefined") ? 7 : days_ahead;
      if(entries != null && firstDay != null) {
        for(var i = 0; i < entries.length; i++){
          var today = firstDay.getTime() - 24*60*60*1000;
          var seven_days_ahead = today + (days_ahead)*24*60*60*1000;
          var date = [entries[i].metrics.date.substring(0,4),entries[i].metrics.date.substring(5,7),entries[i].metrics.date.substring(8,10)];
          var entry_date = new Date(date[0], date[1]-1, date[2]).getTime();
          
          if (seven_days_ahead >= entry_date && today < entry_date) {
            dateList.push(entries[i]);
          }
        }
      }
      return dateList;
  };
})

.controller( 'LogViewCtrl', function LogViewCtrl( $scope, $firebase, $stateParams, dateFilterFilter ) {
  //Initialize variables
  $scope.type = $stateParams.type;
  $scope.current = {};
  $scope.rangeDistance = 0;

  $scope.beginningOfWeek = new Date();
  /*
    weeks start on Mondays (this will be variable eventually), so the default page, if it is
    currently a Sunday, should be the previous Monday
  */
  if($scope.beginningOfWeek.getDay() !== 0){
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate() - $scope.beginningOfWeek.getDay() + 1);
  }
  else {
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate() - 6);
  }

  //Define Functions
  $scope.changeDay = function(number) {
    //reset range distance whenever range is changed
    //not a great solution, but it works
    $scope.rangeDistance = 0;
    $scope.usedIndexes = [];
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate() + number);
    $scope.distanceAdder();
  };
  $scope.setDate = function(date) {
    $scope.rangeDistance = 0;
    $scope.usedIndexes = [];
    console.log(date);
    if (date != null){
      $scope.beginningOfWeek = new Date(date);
      $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate());
    }
    $scope.distanceAdder();
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

  $scope.runTypeTableClass = function (runType) {
    switch(runType){
      case "Easy":
        return "";
      case "Workout":
        return "info";
      case "Long":
        return "warning";
      case "Race":
        return "danger";
      default:
        return "";
    }
  };
  $scope.setCurrent = function (entry) {

    $scope.current.entry = entry;
  };

  $scope.distanceAdder = function () {
    $scope.rangeDistance = 0;
    for (var i = 0; i < $scope.entriesArray.length; i++) {
      if($scope.showDate($scope.entriesArray[i])) {
        console.log("DISTANCE TO ADD : "+ $scope.entriesArray[i].metrics.distance);
        $scope.rangeDistance += $scope.entriesArray[i].metrics.distance;
      }
    }
  };

  $scope.filterDates = function (dates, firstDay) {
    $scope.filteredDates = dateFilterFilter(dates, firstDay);
    $scope.rangeDistance = 0;
    for(var i = 0; i < $scope.filteredDates.length; i++){
      $scope.rangeDistance += $scope.filteredDates[i].metrics.distance;
    }
    return $scope.filteredDates;
  };

  $scope.showDate = function (entry) {
    var today = $scope.beginningOfWeek.getTime() - 24*60*60*1000;
    var seven_days_ahead = today + (7)*24*60*60*1000;
    var date = [entry.metrics.date.substring(0,4),entry.metrics.date.substring(5,7),entry.metrics.date.substring(8,10)];
    var entry_date = new Date(date[0], date[1]-1, date[2]).getTime();
    
    if (seven_days_ahead >= entry_date && today < entry_date) {
      return true;
    }
        
    return false;
  };


})

;
