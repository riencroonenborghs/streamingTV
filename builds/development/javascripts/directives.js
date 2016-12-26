var app;

app = angular.module("streamingTV.directives", []);

app.directive("rating", [
  function() {
    return {
      scope: {
        stars: "="
      },
      template: '<span class="rating"><ng-md-icon icon="star" size="16"></ng-md-icon>{{stars | number: 2}}</span>'
    };
  }
]);

app.directive("navbar", [
  function() {
    return {
      restrict: "E",
      scope: {
        model: "="
      },
      templateUrl: "ui/navbar.html",
      controller: [
        "$scope", "$location", function($scope, $location) {
          return $scope.go = function(url) {
            return $location.path(url);
          };
        }
      ]
    };
  }
]);
