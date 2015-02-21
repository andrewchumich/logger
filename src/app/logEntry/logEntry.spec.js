describe( 'logEntry section', function() {
  beforeEach( module( 'ngBoilerplate' ) );

beforeEach( inject( function( $controller, _$location_, $rootScope ) {
  $location = _$location_;
  $scope = $rootScope.$new();
  AppCtrl = $controller( 'LogEntryCtrl', { $location: $location, $scope: $scope });
}));

  it( 'should have a dummy test', inject( function() {
    expect( true ).toBeTruthy();
  }));

  // TODO use mockfirebase to test addFormData function
});
