var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'KodiRemote2-darwin-x64', 'KodiRemote2.app', 'Contents', 'MacOS', 'KodiRemote2');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'KodiRemote2-linux-x64', 'KodiRemote2');
      default:
        throw 'Unsupported platform';
    }
  }
};
