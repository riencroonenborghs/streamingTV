app = angular.module "streamingTV.services", []

app.service "TraktTVAPI", [ "$q", "$http", ($q, $http) ->
  apiPath: "https://api.trakt.tv"
  searchTvShows: (query) -> @_sendRequest "#{@apiPath}/search/show?query=#{query}&extended=full"
  tvShow: (tvShowId) -> @_sendRequest "#{@apiPath}/shows/#{tvShowId}?extended=full"
  tvShowSeasons: (tvShowId) -> @_sendRequest "#{@apiPath}/shows/#{tvShowId}/seasons?extended=full"
  tvShowSeason: (tvShowId, season) -> @_sendRequest "#{@apiPath}/shows/#{tvShowId}/seasons/#{season}?extended=full"
  tvShowEpisode: (tvShowId, season, episode) -> @_sendRequest "#{@apiPath}/shows/#{tvShowId}/seasons/#{season}/episodes/#{episode}?extended=full"
  _sendRequest: (url) ->
    deferred = $q.defer()
    options = 
      method: "GET"
      url: url
      headers:
        "Content-Type": "application/json"
        "trakt-api-key": "9823361b8f87af7e623796bb16cee09c8e8b026fb399e0b073ae32ce9ab951b5"
        "trakt-api-version": "2"
    success = (response) =>
      deferred.resolve response.data
      return
    failure = (response) ->
      deferred.reject response.data
      return
    $http(options).then(success, failure)
    return deferred.promise
]