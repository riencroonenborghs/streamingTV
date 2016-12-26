var electron, json, path;

path = require("path");

json = require("../package.json");

electron = require("electron");

electron.app.on("ready", function() {
  var window;
  window = new electron.BrowserWindow({
    title: json.name,
    width: json.settings.width,
    height: json.settings.height
  });
  if (json.settings.devTools) {
    window.webContents.openDevTools({
      detach: true
    });
  }
  window.loadURL("file://" + (path.join(__dirname, '..')) + "/views/app.html");
  window.webContents.on("did-finish-load", function() {
    return window.webContents.send("loaded", {
      appName: json.name,
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromiumVersion: process.versions.chrome
    });
  });
  return window.on("closed", function() {
    return window = null;
  });
});
