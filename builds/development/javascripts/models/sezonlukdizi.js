var Sezonlukdizi, streamingTV,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

streamingTV = window.streamingTV || (window.streamingTV = {});

streamingTV.Sezonlukdizi = Sezonlukdizi = (function(superClass) {
  extend(Sezonlukdizi, superClass);

  function Sezonlukdizi(http, q) {
    this.http = http;
    this.q = q;
    Sezonlukdizi.__super__.constructor.apply(this, arguments);
    this.base_link = "http://sezonlukdizi.com";
    this.search = "/js/dizi.js";
    this.cache = null;
  }

  Sezonlukdizi.prototype.toString = function() {
    return "Sezonlukdizi";
  };

  Sezonlukdizi.prototype._url = function(title, season, episode) {
    var deferred, url;
    deferred = this.q.defer();
    if (this.cache) {
      url = this._constructUrl(title, season, episode);
      if (url) {
        deferred.resolve(url);
      } else {
        deferred.reject(url);
      }
    } else {
      this.http.get("" + this.base_link + this.search).then((function(_this) {
        return function(response) {
          var dataMatch, i, len, matches, ref;
          _this.cache = {};
          ref = response.data.match(/\{(.+?)\}/g);
          for (i = 0, len = ref.length; i < len; i++) {
            dataMatch = ref[i];
            matches = dataMatch.match(/d\:\"(.*)\",id\:\"(.*)\"(.*)u\:\"\/diziler\/(.*)\.html\"/);
            _this.cache[matches[1]] = matches[4];
          }
          console.debug(_this.cache);
          url = _this._constructUrl(title, season, episode);
          if (url) {
            return deferred.resolve(url);
          } else {
            return deferred.reject(url);
          }
        };
      })(this));
    }
    return deferred.promise;
  };

  Sezonlukdizi.prototype._constructUrl = function(title, season, episode) {
    if (this.cache && this.cache[title]) {
      return "/" + this.cache[title] + "/" + season + "-sezon-" + episode + "-bolum.html";
    } else {
      return null;
    }
  };

  Sezonlukdizi.prototype.getSources = function(title, season, episode) {
    var _urlError, _urlSuccess, deferred;
    deferred = this.q.defer();
    _urlError = (function(_this) {
      return function(url) {
        return deferred.resolve({
          provider: _this.toString(),
          sources: []
        });
      };
    })(this);
    _urlSuccess = (function(_this) {
      return function(url) {
        var sources;
        sources = [];
        if (!url) {
          deferred.resolve({
            provider: _this.toString(),
            sources: sources
          });
          return;
        }
        return _this.http.get("" + _this.base_link + url).then(function(response) {
          var dom, iframeSrc;
          dom = $(response.data);
          iframeSrc = dom.find("#embed iframe").attr("src");
          if (!iframeSrc.match("http")) {
            iframeSrc = "http:" + iframeSrc;
          }
          return _this.http.get(iframeSrc).then(function(response) {
            var i, len, ref, videoMatch, videosMatch;
            ref = response.data.match(/video.push\(\{(.+?)\}\)/g);
            for (i = 0, len = ref.length; i < len; i++) {
              videosMatch = ref[i];
              videoMatch = videosMatch.match(/file\:\"(.+?)\", label:\"(.+?)\"/);
              sources.push({
                url: videoMatch[1],
                quality: videoMatch[2],
                provider: "Sezonlukdizi"
              });
            }
            return deferred.resolve({
              provider: _this.toString(),
              sources: sources
            });
          });
        });
      };
    })(this);
    this._url(title, season, episode).then(_urlSuccess, _urlError);
    return deferred.promise;
  };

  return Sezonlukdizi;

})(streamingTV.SourceBase);
