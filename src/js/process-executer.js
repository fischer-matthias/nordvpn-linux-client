var dom = require('./dom')();
var logOutput = require('./log-output')(dom.getLogList());

var sudo = require('electron-sudo');

module.exports = function (rootPath) {

    function logStartInfo(user, file) {
        logOutput.append('--------------- Nordvpn-Info ---------------');
        logOutput.append('User: ' + user);
        logOutput.append('File: ' + file);
        logOutput.append('--------------- Nordvpn-Info ---------------');
    }

    function prepareLogs() {
        if (_process.childProcess !== null) {
            _process.childProcess.stdout.on('data', function (data) {
                logOutput.append(data);
            });

            _process.childProcess.stderr.on('data', function (data) {
                logOutput.append(data);
            });
        }
    }

    var _process = {};
    _process.rootPath = rootPath;
    _process.childProcess = null;

    _process.start = function (configFile, authFile) {

        var options = {
            name: 'nordvpn subprocess',
            process: {
                on: function (ps) {
                    _process.childProcess = ps;
                    logOutput.append('Starting process ...');
                    prepareLogs();
                },
                stdout: function (msg) {
                    logOutput.append(msg);
                },
                stderr: function (err) {
                    logOutput.append(err);
                }
            }
        };

        var concatedCommand = 'openvpn --config "' + configFile + '" --auth-user-pass "' + authFile + '"';
        sudo.exec(concatedCommand, options, function (error) {
            logOutput.append(error);
        });
    }

    _process.stop = function () {
        if (_process.childProcess !== null) {
            _process.childProcess.kill();
            return 0;
        }

        return 1;
    }

    return _process;
}