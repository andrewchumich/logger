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
  })
  .state( 'logViewSet', {
    url: '/logView/:type/:date',
    views: {
      "main": {
        controller: 'LogViewCtrl',
        templateUrl: 'logView/logView.tpl.html'
      }
    },
    data:{ pageTitle: 'Log View' }
  });

})



//custom filter to return objects whose date attributes are within a certain range
.filter('dateFilter', function() {
  return function (entries, firstDay, daysAhead) {
      var dateList = [];
      daysAhead = (typeof daysAhead === "undefined") ? 7 : daysAhead;
      if(entries !== null && entries !== undefined && firstDay !== null && firstDay !== undefined) {
        for(var i = 0; i < entries.length; i++){

          var today = firstDay.getTime() - 24*60*60*1000;
          daysAhead = today + (daysAhead)*24*60*60*1000;
          // TODO add logic to account for old date style
          var entry_date = new Date(entries[i].metrics.date);
          entry_date = entry_date.getTime();

          if (seven_daysAhead >= entry_date && today < entry_date) {
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
  $scope.daysAhead = 7;
  $scope.deleteConfirm = false;
  $scope.beginningOfWeek = $scope.makeDate($stateParams.date);

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
  //Change current day by a number of days
  $scope.changeDay = function(number) {
    //reset range distance whenever range is changed
    //not a great solution, but it works
    $scope.rangeDistance = 0;
    $scope.beginningOfWeek.setDate($scope.beginningOfWeek.getDate() + number);
    $scope.distanceAdder();
    $scope.current = {};
  };

  // set current date to given date
  $scope.setDate = function(date) {
    $scope.rangeDistance = 0;
    if (date != null){
      $scope.beginningOfWeek = $scope.makeDate(date);
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

  // sum distances of current week
  $scope.distanceAdder = function () {
    $scope.rangeDistance = 0;
    for (var i = 0; i < $scope.entriesArray.length; i++) {
      if($scope.showDate($scope.entriesArray[i].metrics.date)) {
        $scope.rangeDistance += $scope.entriesArray[i].metrics.distance;
      }
    }
  };

  $scope.deleteEntry = function (entry) {
    $scope.entriesArray.$remove(entry).then(function(ref) {
        console.log("NAME OF REMOVED ENTRY: "+ref.name());
        $scope.deleteConfirm = false; // true
        $scope.current = {}; // true
    });
  };

  $scope.filterDates = function (dates, firstDay) {

    $scope.filteredDates = dateFilterFilter(dates, firstDay);
    $scope.rangeDistance = 0;
    for(var i = 0; i < $scope.filteredDates.length; i++){
      $scope.rangeDistance += $scope.filteredDates[i].metrics.distance;
    }
    return $scope.filteredDates;
  };

  $scope.showDate = function (date) {
    var today = $scope.beginningOfWeek.getTime() - 24*60*60*1000;
    var futureDate = today + ($scope.daysAhead)*24*60*60*1000;
    var entryDate = date.getTime();
    if (futureDate >= entryDate && today < entryDate) {
      return true;
    }

    return false;
  };


})

;
