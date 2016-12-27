streamingTV = window.streamingTV ||= {}
streamingTV.SourceBase = class SourceBase
  constructor: (@http, @q) ->
  ljust: (s, n = 2, padding = "0") -> 
    s = new String(s)
    if s.length < n then (padding.repeat(n - s.length) + s) else s
  @getSources: ->
    [Sezonlukdizi, Crazy4TV, DailyReleases, DDLValley]