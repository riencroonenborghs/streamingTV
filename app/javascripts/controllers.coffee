app = angular.module "streamingTV.controllers", []

app.controller "AppController", [ "$scope", "$location", "$http", "$q", ($scope, $location, $http, $q) -> 
  $scope.visit = (path) -> $location.path path
  $scope.visitTvShow = (id) -> $location.path "/tvShows/#{id}"
  $scope.visitTvShowSeason = (id, season) -> $location.path "/tvShows/#{id}/seasons/#{season}"
  $scope.visitTvShowEpisode = (id, season, episode) -> $location.path "/tvShows/#{id}/seasons/#{season}/episodes/#{episode}"

  # console.debug SourceBase.sources()

  # a = new Crazy4TV($http, $q)
  # a.getSources("Silicon", 1, 1).then (sources) ->
  #   console.debug "sources"
  #   console.debug sources

  # a = new Sezonlukdizi($http, $q)
  # a.getSources().then (sources) ->
  #   console.debug sources
  # TraktTVAPI.searchTvShows("Burgers").then (data) ->
    # console.debug data
]


app.controller "SearchController", [ "$scope", "TraktTVAPI", ($scope, TraktTVAPI) -> 
  $scope.model          = {query: ""}
  $scope.searchResults  = []
  $scope.searching      = false

  $scope.performKeyDownSearch = (event) -> $scope.performSearch() if event.keyCode == 13  # enter
  $scope.performSearch        = ->
    $scope.searching = true
    TraktTVAPI.searchTvShows($scope.model.query).then (data) ->
      $scope.searchResults  = data
      $scope.searching      = false
]

app.controller "TvShowController", ["$scope", "$routeParams", "TraktTVAPI", "NavbarFactory",
($scope, $routeParams, TraktTVAPI, NavbarFactory) ->
  tvShowId        = $routeParams.id
  $scope.tvShow   = null
  $scope.seasons  = []
  $scope.busy     = true

  TraktTVAPI.tvShow(tvShowId).then (data) ->
    $scope.tvShow = data
    $scope.Navbar = new NavbarFactory
    $scope.Navbar.addTitle "TV Shows"
    $scope.Navbar.addTitle $scope.tvShow.title

    TraktTVAPI.tvShowSeasons(tvShowId).then (data) ->
      $scope.seasons = data
      $scope.busy   = false
]

app.controller "TvShowSeasonController", ["$scope", "$routeParams", "TraktTVAPI", "NavbarFactory",
($scope, $routeParams, TraktTVAPI, NavbarFactory) ->
  tvShowId            = $routeParams.id
  $scope.seasonNumber = $routeParams.season
  $scope.tvShow       = null
  $scope.season       = null
  $scope.busy         = true

  TraktTVAPI.tvShow(tvShowId).then (data) ->
    $scope.tvShow = data
    $scope.Navbar = new NavbarFactory
    $scope.Navbar.addTitle "TV Shows"
    $scope.Navbar.addLink "/tvShows/#{$scope.tvShow.ids.trakt}", $scope.tvShow.title
    $scope.Navbar.addTitle "Season #{$scope.seasonNumber}"
    TraktTVAPI.tvShowSeason(tvShowId, $scope.seasonNumber).then (data) ->
      $scope.season = data
      $scope.busy   = false      
]

app.controller "TvShowEpisodeController", ["$scope", "$routeParams", "TraktTVAPI", "NavbarFactory", "$http", "$q", "video",
($scope, $routeParams, TraktTVAPI, NavbarFactory, $http, $q, video) ->
  tvShowId              = $routeParams.id
  $scope.seasonNumber   = $routeParams.season
  $scope.episodeNumber  = $routeParams.episode
  $scope.tvShow         = null
  $scope.episode        = null
  $scope.busy           = true

  TraktTVAPI.tvShow(tvShowId).then (data) ->
    $scope.tvShow = data    
    TraktTVAPI.tvShowEpisode(tvShowId, $scope.seasonNumber, $scope.episodeNumber).then (data) ->
      $scope.episode = data
      $scope.Navbar = new NavbarFactory
      $scope.Navbar.addTitle "TV Shows"
      $scope.Navbar.addLink "/tvShows/#{$scope.tvShow.ids.trakt}", $scope.tvShow.title
      $scope.Navbar.addLink "/tvShows/#{$scope.tvShow.ids.trakt}/seasons/#{$scope.seasonNumber}", "Season #{$scope.seasonNumber}"
      $scope.Navbar.addTitle "Episode #{$scope.episodeNumber}: #{$scope.episode.title}"
      $scope.busy   = false      

      $scope.sources = {}
      for sourceClass in SourceBase.getSources()
        object = new sourceClass $http, $q
        $scope.sources[object.toString()] = {busy: true, sources: []}
        object.getSources($scope.tvShow.title, $scope.seasonNumber, $scope.episodeNumber).then (sources) =>
          $scope.sources[sources.provider].busy = false 
          $scope.sources[sources.provider].sources = sources.sources

      $scope.playing = false
      $scope.watch = (source) ->
        $scope.playing = true
        source.url = "http:#{source.url}" unless source.url.match("http")
        video.addSource("mp4", source.url)

]



