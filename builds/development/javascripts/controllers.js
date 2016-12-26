var app;

app = angular.module("streamingTV.controllers", []);

app.controller("AppController", [
  "$scope", "$location", "$http", "$q", function($scope, $location, $http, $q) {
    $scope.visit = function(path) {
      return $location.path(path);
    };
    $scope.visitTvShow = function(id) {
      return $location.path("/tvShows/" + id);
    };
    $scope.visitTvShowSeason = function(id, season) {
      return $location.path("/tvShows/" + id + "/seasons/" + season);
    };
    return $scope.visitTvShowEpisode = function(id, season, episode) {
      return $location.path("/tvShows/" + id + "/seasons/" + season + "/episodes/" + episode);
    };
  }
]);

app.controller("SearchController", [
  "$scope", "TraktTVAPI", function($scope, TraktTVAPI) {
    $scope.model = {
      query: ""
    };
    $scope.searchResults = [];
    $scope.searching = false;
    $scope.performKeyDownSearch = function(event) {
      if (event.keyCode === 13) {
        return $scope.performSearch();
      }
    };
    return $scope.performSearch = function() {
      $scope.searching = true;
      return TraktTVAPI.searchTvShows($scope.model.query).then(function(data) {
        $scope.searchResults = data;
        return $scope.searching = false;
      });
    };
  }
]);

app.controller("TvShowController", [
  "$scope", "$routeParams", "TraktTVAPI", "NavbarFactory", function($scope, $routeParams, TraktTVAPI, NavbarFactory) {
    var tvShowId;
    tvShowId = $routeParams.id;
    $scope.tvShow = null;
    $scope.seasons = [];
    $scope.busy = true;
    return TraktTVAPI.tvShow(tvShowId).then(function(data) {
      $scope.tvShow = data;
      $scope.Navbar = new NavbarFactory;
      $scope.Navbar.addTitle("TV Shows");
      $scope.Navbar.addTitle($scope.tvShow.title);
      return TraktTVAPI.tvShowSeasons(tvShowId).then(function(data) {
        $scope.seasons = data;
        return $scope.busy = false;
      });
    });
  }
]);

app.controller("TvShowSeasonController", [
  "$scope", "$routeParams", "TraktTVAPI", "NavbarFactory", function($scope, $routeParams, TraktTVAPI, NavbarFactory) {
    var tvShowId;
    tvShowId = $routeParams.id;
    $scope.seasonNumber = $routeParams.season;
    $scope.tvShow = null;
    $scope.season = null;
    $scope.busy = true;
    return TraktTVAPI.tvShow(tvShowId).then(function(data) {
      $scope.tvShow = data;
      $scope.Navbar = new NavbarFactory;
      $scope.Navbar.addTitle("TV Shows");
      $scope.Navbar.addLink("/tvShows/" + $scope.tvShow.ids.trakt, $scope.tvShow.title);
      $scope.Navbar.addTitle("Season " + $scope.seasonNumber);
      return TraktTVAPI.tvShowSeason(tvShowId, $scope.seasonNumber).then(function(data) {
        $scope.season = data;
        return $scope.busy = false;
      });
    });
  }
]);

app.controller("TvShowEpisodeController", [
  "$scope", "$routeParams", "TraktTVAPI", "NavbarFactory", "$http", "$q", "video", function($scope, $routeParams, TraktTVAPI, NavbarFactory, $http, $q, video) {
    var tvShowId;
    tvShowId = $routeParams.id;
    $scope.seasonNumber = $routeParams.season;
    $scope.episodeNumber = $routeParams.episode;
    $scope.tvShow = null;
    $scope.episode = null;
    $scope.busy = true;
    return TraktTVAPI.tvShow(tvShowId).then(function(data) {
      $scope.tvShow = data;
      return TraktTVAPI.tvShowEpisode(tvShowId, $scope.seasonNumber, $scope.episodeNumber).then(function(data) {
        var i, len, object, ref, sourceClass;
        $scope.episode = data;
        $scope.Navbar = new NavbarFactory;
        $scope.Navbar.addTitle("TV Shows");
        $scope.Navbar.addLink("/tvShows/" + $scope.tvShow.ids.trakt, $scope.tvShow.title);
        $scope.Navbar.addLink("/tvShows/" + $scope.tvShow.ids.trakt + "/seasons/" + $scope.seasonNumber, "Season " + $scope.seasonNumber);
        $scope.Navbar.addTitle("Episode " + $scope.episodeNumber + ": " + $scope.episode.title);
        $scope.busy = false;
        $scope.sources = {};
        ref = SourceBase.getSources();
        for (i = 0, len = ref.length; i < len; i++) {
          sourceClass = ref[i];
          object = new sourceClass($http, $q);
          $scope.sources[object.toString()] = {
            busy: true,
            sources: []
          };
          object.getSources($scope.tvShow.title, $scope.seasonNumber, $scope.episodeNumber).then((function(_this) {
            return function(sources) {
              $scope.sources[sources.provider].busy = false;
              return $scope.sources[sources.provider].sources = sources.sources;
            };
          })(this));
        }
        $scope.playing = false;
        return $scope.watch = function(source) {
          $scope.playing = true;
          if (!source.url.match("http")) {
            source.url = "http:" + source.url;
          }
          return video.addSource("mp4", source.url);
        };
      });
    });
  }
]);
