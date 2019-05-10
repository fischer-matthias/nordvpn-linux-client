var spawn = require('child_process').spawn;
var logger = require('./logger')();

module.exports = function () {

    var _process = {};
    _process.childProcess = null;
    _process.pid = null;

    _process.start = function (configFile, authFile) {

        _process.childProcess = spawn('pkexec', ['openvpn', '--config', configFile, '--auth-user-pass', authFile]);

        _process.pid = _process.childProcess.pid;
        console.log(`Started openvpn-subprocess with pid ${_process.pid}.`);
        domManipulator.getStatus().value = 'Process started ...';
        notificator.message('Status', 'Connection successful!');

        _process.childProcess.stdout.on('data', function (data) {
            logger.append(data.toString());
        });

        _process.childProcess.stderr.on('data', function (data) {
            logger.append(data.toString());
        });

        _process.childProcess.on('exit', function (code) {
            console.log(`Stopped openvpn process with code ${code.toString()}.`);
        });
    }

    _process.stop = function () {
        if (_process.pid !== null) {
            const killProcess = spawn('pkexec', ['kill', _process.pid]);
            killProcess.on('exit', function (code) {
                if (code != 0) {
                    logger.append(`Killprocess returned with code ${code}`);
                }
            });
        }
    }

    return _process;
}