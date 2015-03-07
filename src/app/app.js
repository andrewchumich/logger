angular.module('ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ui.bootstrap',
    'ngBoilerplate.home',
    'ngBoilerplate.about',
    'ngBoilerplate.logView',
    'ngBoilerplate.logEntry',
    'ngBoilerplate.logHome',
    'ngBoilerplate.logIn',
    'ngBoilerplate.logRegister',
    'firebase',
    'ui.router',
    'ngAnimate',
    'd3'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
})

.run(function run() {})



.controller('AppCtrl', function AppCtrl($scope, $window, $location, $state, $firebase, $firebaseSimpleLogin) {
        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
            }
        });




        $scope.loaded = false;

        var ref = new Firebase('https://runninglog.firebaseio.com');
        $scope.auth = $firebaseSimpleLogin(ref);

        $scope.userSetup = function(user) {
            $scope.firebase.users = {};
            $scope.firebase.users[user.uid.toString()] = $firebase(new Firebase('https://runninglog.firebaseio.com/users/' + user.uid.toString())).$asObject();
            $scope.firebase.users[user.uid.toString()].$loaded().then(function() {
                $scope.type = $scope.firebase.users[user.uid].defaultLog;
                $scope.log = $firebase(new Firebase('https://runninglog.firebaseio.com/users/' + $scope.auth.user.uid.toString() + '/userLogs/' + $scope.type)).$asObject();
                $scope.entriesArray = $firebase(new Firebase('https://runninglog.firebaseio.com/users/' + $scope.auth.user.uid.toString() + '/userLogs/' + $scope.type + '/entries')).$asArray();
                $scope.entries = $firebase(new Firebase('https://runninglog.firebaseio.com/users/' + $scope.auth.user.uid.toString() + '/userLogs/' + $scope.type + '/entries')).$asObject();
                $scope.entries.$loaded().then(function() {
                    $scope.$broadcast("EntriesLoaded", $scope.entries);
                });
                $scope.logTemplate = $firebase(new Firebase('https://runninglog.firebaseio.com/logs/' + $scope.type)).$asObject();
                $scope.loaded = true;
            });
        };

        $scope.attemptLogIn = function(data) {
            console.log($scope.auth.$login().then());
            $scope.auth.$login('password', {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe
            }).then(function(user) {
                $scope.error = "";
                $scope.userSetup(user);
                $location.path('/logHome/' + $scope.type);
                console.log("Logged in as: ", user.uid);

            }, function(error) {
                console.error("Login failed: ", error);
                $scope.error = error.toString();
            });
        };

        $scope.logOut = function() {
            $scope.auth.$logout().then(function(a) {
                console.log("LOG OUT DATA: " + a);
            });
            $scope.loaded = false;
        };


        $scope.makeDate = function(date) {
            if (date === undefined || date === null || date === "" || date === 0) {
                return new Date();
            } else {
                if (isNaN(Number(date))) {
                    return new Date(date);
                } else {
                    return new Date(Number(date));
                }
            }
        };

        $scope.firebase = {};
        $scope.firebase.logs = $firebase(new Firebase('https://runninglog.firebaseio.com/logs')).$asObject();
        $scope.firebase.logs.$loaded().then(function() {
            //I'm not sure if the auth object will always return quickly upon instantiation
            //there should be a way to wait for it?
            $scope.auth.$getCurrentUser().then(function(user) {
                if (user) {
                    $scope.userSetup(user);
                }


            });
        });

    })
    .directive('d3Bars', function($window, d3Service) {
        return {
            restrict: 'EA',
            scope: {
              acData: '=',
              acMetric: '@'
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var margin = parseInt(attrs.margin, 10) || 40,
                        barWidth = parseInt(attrs.barWidth, 10) || 20,
                        barPadding = parseInt(attrs.barPadding, 10) || 5;
                    var svg = d3.select(element[0])
                        .append('svg')
                        .attr({ 'class': 'bar-chart'})
                        .style('width', '100%');

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };


                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.acData, scope.acMetric);
                    });

                    scope.$watch('acData', function(data) {
                        scope.render(scope.acData, scope.acMetric);
                    });

                    scope.render = function(data, metric) {
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (data.length === 0) { return; }

                        // setup variables
                        var width = d3.select(element[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = d3.select(element[0]).node().offsetHeight - margin,
                            // Use the category20() scale function for multicolor support
                            color = d3.scale.category20(),
                            // our xScale
                            yScale = d3.scale.linear()
                            .domain([0, d3.max(data, function(d) {
                                return d.metrics[metric];
                            })])
                            .range([height, 0]),
                            barWidth = 20;

                        var x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], 0.1);

                        var y = d3.scale.linear()
                            .range([height, 0]);

                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("left")
                            .ticks(10, "%");

                        y.domain([0, d3.max(data, function(d) { return d.metrics[metric]; })]);
                        x.domain(data.map(function(d) { return d.metrics[metric]; }));

                        var chart = d3.select(".bar-chart")
                            .attr("width", width);

                        chart.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis);

                        chart.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                        .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 6)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text(metric);


                      chart.selectAll(".bar")
                          .data(data)
                        .enter().append("rect")
                          .attr("class", "bar")
                          .attr("x", function(d) { return x(d.metrics[metric]); })
                          .attr("width", x.rangeBand())
                          .attr("y", function(d) { return y(d.metrics[metric]); })
                          .attr("height", function(d) { return height - y(d.metrics[metric]); })
                          .attr("fill", function(d) { return color(d.metrics["runType"]); });
                    };
                });
            }
        };
    })

;
