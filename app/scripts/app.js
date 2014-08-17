'use strict';
angular.module('lodash', [])
.factory('_', function () {
  return window._;
});

angular.module('diceApp', [
  'ngSanitize',
  'ngRoute',
  'lodash'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});
