var app;

app = angular.module("streamingTV.services", []);

app.service("TraktTVAPI", [
  "$q", "$http", function($q, $http) {
    return {
      apiPath: "https://api.trakt.tv",
      searchTvShows: function(query) {
        return this._sendRequest(this.apiPath + "/search/show?query=" + query + "&extended=full");
      },
      tvShow: function(tvShowId) {
        return this._sendRequest(this.apiPath + "/shows/" + tvShowId + "?extended=full");
      },
      tvShowSeasons: function(tvShowId) {
        return this._sendRequest(this.apiPath + "/shows/" + tvShowId + "/seasons?extended=full");
      },
      tvShowSeason: function(tvShowId, season) {
        return this._sendRequest(this.apiPath + "/shows/" + tvShowId + "/seasons/" + season + "?extended=full");
      },
      tvShowEpisode: function(tvShowId, season, episode) {
        return this._sendRequest(this.apiPath + "/shows/" + tvShowId + "/seasons/" + season + "/episodes/" + episode + "?extended=full");
      },
      _sendRequest: function(url) {
        var deferred, failure, options, success;
        deferred = $q.defer();
        options = {
          method: "GET",
          url: url,
          headers: {
            "Content-Type": "application/json",
            "trakt-api-key": "9823361b8f87af7e623796bb16cee09c8e8b026fb399e0b073ae32ce9ab951b5",
            "trakt-api-version": "2"
          }
        };
        success = (function(_this) {
          return function(response) {
            deferred.resolve(response.data);
          };
        })(this);
        failure = function(response) {
          deferred.reject(response.data);
        };
        $http(options).then(success, failure);
        return deferred.promise;
      }
    };
  }
]);
