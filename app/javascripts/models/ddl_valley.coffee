streamingTV = window.streamingTV ||= {}
streamingTV.DDLValley = class DDLValley extends streamingTV.Crazy4TV
  constructor: (@http, @q) ->
    super
    @base_link    = "http://www.ddlvalley.cool"
  toString: -> "DDLValley"
  _parseResponse: (response, se) ->
    sources = []
    seRe    = new RegExp("#{se}", "i")    
    dom     = $(response.data)
    for item in dom.find("item")
      for link in $(item).find("enclosure")
        url = $(link)[0].attributes.url
        url = $(url)[0].value
        if url.match seRe
          quality = @_quality(url, se) || "unknown"
          sources.push {url: url, quality: quality, provider: @toString()}
    return sources
