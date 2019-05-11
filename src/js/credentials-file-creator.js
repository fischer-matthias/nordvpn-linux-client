module.exports = function () {
    var _cfc = {};
    var _fileSystem = require('fs');
    var _operatingSystem = require('os');

    _cfc.directoryPath = `${_operatingSystem.homedir()}/.nordvpn-client/`;
    _cfc.filePath = `${_cfc.directoryPath}.cr`;

    _cfc.create = function (user, pass, callback) {
        _fileSystem.writeFile(_cfc.filePath, `${user}\n${pass}`, function (error) {
            if (error) {
                console.error(error);
                callback(false);
            } else {
                console.log(`Created credentials file.`);
                callback(true);
            }
        });
    }

    _cfc.read = function (callback) {
        _fileSystem.readFile(_cfc.filePath, function (error, data) {
            if (error) {
                console.error(error);
                callback({
                    user: '',
                    pass: ''
                });
            } else {
                var userPass = (data.toString()).split('\n');
                if (userPass.length < 2) {
                    callback({
                        user: '',
                        pass: ''
                    });
                } else {
                    callback({
                        user: userPass[0],
                        pass: userPass[1]
                    });
                }
            }
        });
    }

    _cfc.delete = function (callback) {
        _fileSystem.unlink(_cfc.filePath, function (error) {
            if (error) {
                console.error(error);
            } else {
                callback();
            }
        })
    }

    return _cfc;
}