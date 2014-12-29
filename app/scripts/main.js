(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');
  var homeCtrl = require('./controllers/homectrl');
  var aboutCtrl = require('./controllers/aboutctrl');

  angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

  .config([
    '$routeProvider',
    function($routeProvider) {
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./views/home.html",
          controller: "HomeController"
        })
        .when("/about", {
          templateUrl: "./views/about.html",
          controller: "AboutController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ])

  //Load controllers
  .controller('HomeController', ['$scope', homeCtrl])
  .controller('AboutController', ['$scope', aboutCtrl]);


}());