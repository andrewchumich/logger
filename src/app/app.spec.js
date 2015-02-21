describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'ngBoilerplate' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
    }));


    it( 'parent of scope should be null', inject( function() {
      expect( $scope.$root.$parent ).toBeNull();
    }));

    it('makeDate should return current date when given null', function() {
      var date = new Date();
      // give the coparison a range because the Date() will not be called at the exact time
      expect($scope.makeDate(null).getTime()).toBeCloseTo(date.getTime(),-100);
    });

    it('makeDate should return current date when given blank string', function() {
      var date = new Date();
      // give the coparison a range because the Date() will not be called at the exact time
      expect($scope.makeDate("").getTime()).toBeCloseTo(date.getTime(),-100);
    });


  });
});
