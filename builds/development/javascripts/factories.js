var app;

app = angular.module("streamingTV.factories", []);

app.factory("NavbarFactory", [
  function() {
    var Model;
    return Model = (function() {
      function Model() {
        this.list = [];
      }

      Model.prototype.addTitle = function(title) {
        return this.list.push({
          type: "title",
          title: title
        });
      };

      Model.prototype.addLink = function(url, label) {
        return this.list.push({
          type: "link",
          url: url,
          label: label
        });
      };

      return Model;

    })();
  }
]);
