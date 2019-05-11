module.exports = function (config, cfc) {

    var _process = {};
    var _spawn = require('child_process').spawn;
    var _logger = require('./logger')();
    var _domMainpulator = require('./dom-manipulator')();

    var _config = config;
    var _cfc = cfc;

    _process.childProcess = null;
    _process.pid = null;

    _process.start = function (configFile, authFile) {

        var isFileDeleted = _config.config.saveCredentials;

        _process.childProcess = _spawn('pkexec', ['openvpn', '--config', configFile, '--auth-user-pass', authFile]);
        _process.pid = _process.childProcess.pid;

        var timestamp = _logger.fakeTimestamp();
        _logger.append(`${timestamp} Started openvpn-subprocess with pid ${_process.pid}.`);
        _domMainpulator.getStatus().value = 'starting';
        _domMainpulator.getConnect().disabled = true;
        _domMainpulator.getOptions().disabled = true;
        _domMainpulator.getDisconnect().disabled = false;

        _process.childProcess.stdout.on('data', function (data) {
            _logger.append(data.toString().trim());

            if (!isFileDeleted) {
                setTimeout(function () {
                    _cfc.delete(function () {
                        console.log(`Credentials file deleted.`);
                    });
                }, 8000);
                isFileDeleted = true;
            }

            if (data.toString().trim().indexOf('Initialization Sequence Completed') > -1) {
                _domMainpulator.getStatus().value = 'running';
                notificator.message('Status', 'Connection successful!');
            }

            if (data.toString().trim().indexOf('AUTH_FAILED') > -1) {
                notificator.message('Error', 'Authorization failed!');
                _domMainpulator.getPass().value = '';
                _domMainpulator.getPass().focus();
            }
        });

        _process.childProcess.stderr.on('data', function (data) {
            _logger.append(data.toString().trim());
        });

        _process.childProcess.on('exit', function (code) {
            timestamp = _logger.fakeTimestamp();
            _logger.append(`${timestamp} Stopped openvpn - subprocess with code ${code}.`);
            _domMainpulator.getStatus().value = 'stopped';
            notificator.message('Status', 'Connection stopped!');

            _domMainpulator.getConnect().disabled = false;
            _domMainpulator.getOptions().disabled = false;
            _domMainpulator.getDisconnect().disabled = true;
        });
    }

    _process.stop = function () {
        if (_process.pid !== null) {
            const killProcess = _spawn('pkexec', ['kill', _process.pid]);
            killProcess.on('exit', function (code) {
                if (code != 0) {
                    console.error(`Kill - Process exit code ${code}.`);
                }
            });
        }
    }

    return _process;
}