streamingTV = window.streamingTV ||= {}
streamingTV.Crazy4TV = class Crazy4TV extends streamingTV.SourceBase
  constructor: (@http, @q) ->
    super
    @base_link    = "http://crazy4tv.com"
    @search_pre   = "/search/"
    @search_post  = "/feed/rss2/"
  toString: -> "Crazy4TV"
    
  _query: (title, season, episode) -> "#{title} #{@_SE(season, episode)}"
  _SE: (season, episode) -> "S#{@ljust(season)}E#{@ljust(episode)}"
  _quality: (s, se) ->
    re      = new RegExp "#{se}\.([0-9]*p)\.", "i"
    hdtvRe  = new RegExp "#{se}\.HDTV\.", "i"
    matches = s.match re
    hdtvMatches = s.match hdtvRe
    (matches && matches[1]) || (hdtvMatches && "HDTV")

  _parseResponse: (response, se) ->
    sources = []    
    dom     = $(response.data)
    for item in dom.find("item")
      for link in $(item).find("a[target='_blank']")          
        if link.innerText.match "#{se}"
          url     = link.href
          quality = @_quality(link.innerText, se) || "unknown"
          sources.push {url: url, quality: quality, provider: @toString()}
    return sources

  getSources: (title, season, episode) ->
    se      = @_SE season, episode
    query   = @_query title, season, episode
    url     = "#{@base_link}#{@search_pre}#{query}#{@search_post}"
    deferred = @q.defer()

    @http.get(url).then (response) =>      
      deferred.resolve {provider: @toString(), sources: @_parseResponse(response, se)}

    deferred.promise

