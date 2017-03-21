(function () {

	'use strict';

	require ('angular');
	require('angular-route');
	require('angular-animate');
	require('angularfire');

	var addressCtrl = require ('./addressCtrl.js');
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'firebase']);

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
	myApp.controller('addressCtrl', addressCtrl);

}());
