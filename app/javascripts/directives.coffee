app = angular.module "streamingTV.directives", []

app.directive "rating", [->
  scope:
    stars: "="
  template: '<span class="rating"><ng-md-icon icon="star" size="16"></ng-md-icon>{{stars | number: 2}}</span>'
]

app.directive "navbar", [->
  restrict: "E"
  scope:
    model: "="
  templateUrl: "ui/navbar.html"
  controller: [ "$scope", "$location", ($scope, $location) ->
    $scope.go = (url) -> $location.path url
  ]
]