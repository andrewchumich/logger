describe( 'logView section', function() {
    var AppCtrl, LogViewCtrl, $location, $scope;
    beforeEach( module( 'ngBoilerplate' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
        $location = _$location_;
        $scope = $rootScope.$new();
        AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
        LogViewCtrl = $controller( 'LogViewCtrl', { $location: $location, $scope: $scope });
    }));

    it( 'initial day of week should be monday', inject( function() {
        expect( $scope.getDayOfWeek()).toBe("Monday");
    }));

    it( 'show date should be false for bad date', inject( function() {
        var oldDate = new Date(0);
        expect( $scope.showDate(oldDate) ).toBeFalsy();
        $scope.beginningOfWeek = oldDate;
        expect( $scope.showDate(new Date()) ).toBeFalsy();
    }));

    it( 'show date should be true for good date', inject( function() {
        $scope.daysAhead = 7;
        $scope.beginningOfWeek = new Date();
        var date  = new Date();
        date.setDate(date.getDate() + 5);
        expect( $scope.showDate(date) ).toBeTruthy();
    }));

    it( 'change day function should increase or decrease beginningOfWeek', inject(function() {
        var oldDate = $scope.beginningOfWeek.getTime();
        $scope.changeDay(7);
        expect ($scope.beginningOfWeek.getTime() ).toBeGreaterThan(oldDate);
        oldDate = $scope.beginningOfWeek.getTime();
        $scope.changeDay(-4);
        expect ($scope.beginningOfWeek.getTime() ).toBeLessThan(oldDate);

    }));

    it( 'setDate should set beginningOfWeek', inject( function() {
        var newDate = new Date(0);
        $scope.setDate(newDate);
        
        expect( $scope.beginningOfWeek.getTime() ).toBe(newDate.getTime());

    }));

});
