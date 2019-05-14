module.exports = function () {
    var _ndown = {};
    var _fs = require('fs');
    var _os = require('os');
    var _spawn = require('child_process').spawn;
    var _logger = require('./logger')();

    _ndown.path = `${_os.homedir}/.nordvpn-client/ovpn`;
    _ndown.zipPath = _ndown.path + `.zip`;

    _ndown.isDownloaded = function() {
        return _fs.existsSync(_ndown.zipPath);
    }

    _ndown.isExtracted = function() {
        return _fs.existsSync(_ndown.path);
    }

    _ndown.check = function() {
        function remove() {
            _ndown.removeZip(function() {
                console.log('Nordvpn-Downloader Ready.');
            });
        }

        if (!_ndown.isDownloaded() && !_ndown.isExtracted()) {
            _ndown.download(function() {
                _ndown.extract(function() {
                    remove();
                });
            });
        } else {
            if (!_ndown.isExtracted()) {
                _ndown.extract(function() {
                    remove();
                });
            } else {
                if (_ndown.isDownloaded()) {
                    remove();
                }
            }
        }
    }

    _ndown.download = function(callback) {
        var process = _spawn('wget', ['https://downloads.nordcdn.com/configs/archives/servers/ovpn.zip', '-O', _ndown.zipPath]);
        var timestamp = _logger.fakeTimestamp();
        _logger.append(`${timestamp} Started to download nordvpns server configs.`);

        function log(data) {
            _logger.append(data.toString().trim());
        }

        process.stdout.on('data', log);
        process.stderr.on('data', log);

        process.on('exit', function () {
            timestamp = _logger.fakeTimestamp();
            _logger.append(`${timestamp} Finished download.`);
            callback();
        });
    }

    _ndown.extract = function(callback) {
        timestamp = _logger.fakeTimestamp();

        if (_ndown.isDownloaded()) {
            var process = _spawn('unzip', [_ndown.zipPath, '-d', `${_ndown.path}`]);
            _logger.append(`${timestamp} Started to extract "${_ndown.zipPath}".`);

            process.stdout.on('data', function (data) {
                _logger.append(data.toString().trim());
            });
    
            process.on('exit', function () {
                timestamp = _logger.fakeTimestamp();
                _logger.append(`${timestamp} Finished extraction.`);
                callback();
            });

        } else {
            _logger.append(`${timestamp}Error file "${_ndown.zipPath}" not found!`);
        }
    }

    _ndown.removeZip = function(callback) {
        if (_ndown.isDownloaded() && _ndown.isExtracted()) {
            var process = _spawn('rm', [_ndown.zipPath]);
            var timestamp = _logger.fakeTimestamp();
            _logger.append(`${timestamp} Started to remove "${_ndown.zipPath}".`);

            function log(data) {
                _logger.append(data.toString().trim());
            }
    
            process.stdout.on('data', log);
            process.stderr.on('data', log);
    
            process.on('exit', function () {
                timestamp = _logger.fakeTimestamp();
                _logger.append(`${timestamp} "${_ndown.zipPath}" deleted.`);
                callback();
            });
        }
    }

    return _ndown;
}