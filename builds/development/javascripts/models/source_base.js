var SourceBase, streamingTV;

streamingTV = window.streamingTV || (window.streamingTV = {});

streamingTV.SourceBase = SourceBase = (function() {
  function SourceBase(http, q) {
    this.http = http;
    this.q = q;
  }

  SourceBase.prototype.ljust = function(s, n, padding) {
    if (n == null) {
      n = 2;
    }
    if (padding == null) {
      padding = "0";
    }
    s = new String(s);
    if (s.length < n) {
      return padding.repeat(n - s.length) + s;
    } else {
      return s;
    }
  };

  SourceBase.getSources = function() {
    return [Sezonlukdizi, Crazy4TV];
  };

  return SourceBase;

})();
