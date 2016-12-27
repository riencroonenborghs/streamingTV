streamingTV = window.streamingTV ||= {}
streamingTV.DailyReleases = class DailyReleases extends streamingTV.Crazy4TV
  constructor: (@http, @q) ->
    super
    @base_link    = "http://dailyreleases.net"
  toString: -> "DailyReleases"

