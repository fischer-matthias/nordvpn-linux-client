module.exports = function () {
    var _config = {};
    var _fileSystem = require('fs');
    var _operatingSystem = require('os');

    _config.directoryPath = _operatingSystem.homedir() + '/.nordvpn-client/';
    _config.filePath = _config.directoryPath + '.config.json';

    _config.config = {};

    _config.readConfigFile = function (callback) {
        if (checkDirectoryStructure()) {
            _fileSystem.readFile(_config.filePath, function (error, data) {
                if (error) {
                    console.error(error);
                }

                _config.config = JSON.parse(data);
                callback();
            });
        } else {
            callback();
        }
    }

    function checkDirectoryStructure() {
        if (_fileSystem.existsSync(_config.directoryPath)) {
            if (_fileSystem.existsSync(_config.filePath)) {
                return true;
            } else {
                createConfigFile();
                return false;
            }
        } else {
            createDirectoryStructure();
            createConfigFile();
            return false;
        }
    }

    function createDirectoryStructure() {
        _fileSystem.mkdir(_config.directoryPath, function() {
            console.log(`Folder '${_config.directoryPath}' created.`);
        });
    }

    function createConfigFile() {
        _config.config = {
            saveCredentials: false,
            udp_tcp: 'udp'
        };

        _config.writeFile(null);
    }

    _config.writeFile = function (callback) {
        _fileSystem.writeFile(_config.filePath, JSON.stringify(_config.config), function () {
            console.log('Wrote config file.');
            if (callback != null) {
                callback();
            }
        });
    }

    return _config;
}