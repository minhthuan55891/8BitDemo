(function () {

	'use strict';

	require ('angular');
	require('angular-route');
	require('angular-animate');
	require('angularfire');
	require('angular-sanitize');
	require('ng-csv/build/ng-csv.js');

	var addressCtrl = require ('./addressCtrl.js');
	var googleMapDirective = require('./googleMapDirective.js');
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'firebase', 'ngSanitize', 'ngCsv']);

	myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

		$routeProvider
        .when('/', {
          templateUrl: '../views/main.html',
          controller: 'addressCtrl'
        })
        .otherwise({
           redirectTo: '/'
        });

	}]);

	myApp.constant('API', 'https://address-9aaab.firebaseio.com/');
	// myApp.constant('API', 'https://addressdb-2df6e.firebaseio.com/');
	myApp.controller('addressCtrl', addressCtrl);
	myApp.directive('googleMap', googleMapDirective);

}());
