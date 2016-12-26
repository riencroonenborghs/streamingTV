# http://kodi.wiki/view/JSON-RPC_API/v6

streamingTV = window.streamingTV ||= {}

app = angular.module "streamingTV", [
  "ngAria", 
  "ngAnimate", 
  "ngMaterial", 
  "ngMdIcons",
  "ngRoute",
  "ngVideo",
  "streamingTV.controllers",
  "streamingTV.services",
  "streamingTV.directives",
  "streamingTV.factories"
]

app.config ($mdThemingProvider) ->
  $mdThemingProvider.theme("default")
    .primaryPalette("blue")
    .accentPalette("green")

app.config ($routeProvider, $locationProvider) ->
  $routeProvider
    .when "/search",
      templateUrl: "search/index.html"
      controller: "SearchController"
    .when "/tvShows/:id",
      templateUrl: "tvShows/index.html"
      controller: "TvShowController"
    .when "/tvShows/:id/seasons/:season",
      templateUrl: "tvShows/season.html"
      controller: "TvShowSeasonController"
    .when "/tvShows/:id/seasons/:season/episodes/:episode",
      templateUrl: "tvShows/episode.html"
      controller: "TvShowEpisodeController"
    .otherwise "/search",
      templateUrl: "search/index.html"
      controller: "SearchController"
  