app = angular.module "streamingTV.factories", []

app.factory "NavbarFactory", [->
  class Model
    constructor: -> @list = []
    addTitle: (title) -> @list.push type: "title", title: title
    addLink: (url, label) -> @list.push type: "link", url: url, label: label
]