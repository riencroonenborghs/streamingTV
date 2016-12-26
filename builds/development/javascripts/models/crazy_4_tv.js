var Crazy4TV, streamingTV,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

streamingTV = window.streamingTV || (window.streamingTV = {});

streamingTV.Crazy4TV = Crazy4TV = (function(superClass) {
  extend(Crazy4TV, superClass);

  function Crazy4TV(http, q) {
    this.http = http;
    this.q = q;
    Crazy4TV.__super__.constructor.apply(this, arguments);
    this.base_link = "http://crazy4tv.com";
    this.search_pre = "/search/";
    this.search_post = "/feed/rss2/";
  }

  Crazy4TV.prototype.toString = function() {
    return "Crazy4TV";
  };

  Crazy4TV.prototype._query = function(title, season, episode) {
    return title + " " + (this._SE(season, episode));
  };

  Crazy4TV.prototype._SE = function(season, episode) {
    return "S" + (this.ljust(season)) + "E" + (this.ljust(episode));
  };

  Crazy4TV.prototype._quality = function(s, se) {
    var matches;
    matches = s.match(se + "\.([0-9]*p)\.");
    return matches[1];
  };

  Crazy4TV.prototype.getSources = function(title, season, episode) {
    var deferred, query, se, url;
    se = this._SE(season, episode);
    query = this._query(title, season, episode);
    url = "" + this.base_link + this.search_pre + query + this.search_post;
    deferred = this.q.defer();
    this.http.get(url).then((function(_this) {
      return function(response) {
        var dom, i, item, j, len, len1, link, quality, ref, ref1, sources;
        sources = [];
        dom = $(response.data);
        ref = dom.find("item");
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          ref1 = $(item).find("a[target='_blank']");
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            link = ref1[j];
            if (link.innerText.match("" + se)) {
              url = link.href;
              quality = _this._quality(link.innerText, se);
              sources.push({
                url: url,
                quality: quality,
                provider: "Crazy4TV"
              });
            }
          }
        }
        return deferred.resolve({
          provider: _this.toString(),
          sources: sources
        });
      };
    })(this));
    return deferred.promise;
  };

  return Crazy4TV;

})(streamingTV.SourceBase);
