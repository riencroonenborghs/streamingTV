streamingTV = window.streamingTV ||= {}
streamingTV.Sezonlukdizi = class Sezonlukdizi extends streamingTV.SourceBase
  constructor: (@http, @q) ->
    super
    @base_link  = "http://sezonlukdizi.com"
    @search     = "/js/dizi.js"
    @cache      = null
  toString: -> "Sezonlukdizi"
  
  _url: (title, season, episode) ->
    deferred = @q.defer()

    if @cache
      url = @_constructUrl(title, season, episode)
      if url then deferred.resolve(url) else deferred.reject(url)
    else
      @http.get("#{@base_link}#{@search}").then (response) =>
        @cache = {}
        for dataMatch in response.data.match(/\{(.+?)\}/g)
          matches =  dataMatch.match(/d\:\"(.*)\",id\:\"(.*)\"(.*)u\:\"\/diziler\/(.*)\.html\"/)
          @cache[matches[1]] = matches[4]
        url = @_constructUrl(title, season, episode)
        if url then deferred.resolve(url) else deferred.reject(url)

    deferred.promise
      
  _constructUrl: (title, season, episode) ->
    if @cache && @cache[title] then "/#{@cache[title]}/#{season}-sezon-#{episode}-bolum.html" else null

  getSources: (title, season, episode) ->
    deferred = @q.defer()

    _urlError   = (url) => deferred.resolve {provider: @toString(), sources: []}
    _urlSuccess = (url) =>
      sources = []
      unless url
        deferred.resolve {provider: @toString(), sources: sources}
        return
      @http.get("#{@base_link}#{url}").then (response) =>
        dom       = $(response.data)
        iframeSrc = dom.find("#embed iframe").attr("src")
        iframeSrc = "http:#{iframeSrc}" unless iframeSrc.match("http")
        @http.get(iframeSrc).then (response) =>
          for videosMatch in response.data.match(/video.push\(\{(.+?)\}\)/g)
            videoMatch  = videosMatch.match(/file\:\"(.+?)\", label:\"(.+?)\"/)
            sources.push {url: videoMatch[1], quality: videoMatch[2], provider: @toString()}
          deferred.resolve {provider: @toString(), sources: sources}

    @_url(title, season, episode).then _urlSuccess, _urlError

    deferred.promise

