(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');
  var mainCtrl = require('./mainctrl');

  angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./views/partial1.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ])

  //Load controller
  .controller('MainController', ['$scope', mainCtrl]);

}());