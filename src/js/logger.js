module.exports = function () {

    var _console = {};
    var _domManipulator = require('./dom-manipulator')();

    function log(msg) {
        console.log(msg);
        _domManipulator.getLogList().value = msg + '\n' + _domManipulator.getLogList().value;
    }

    _console.append = function (msg) {
        log(msg);
    };

    _console.clear = function () {
        _domManipulator.getLogList().value = '';
    }

    _console.fakeTimestamp = function () {
        var timestamp = '';
        var now = new Date();
        var time = now.toTimeString().substr(0, 8);

        timestamp = now.toDateString();
        timestamp = timestamp.substr(0, timestamp.length - 4);
        timestamp = timestamp + time + ' ' + now.getFullYear();
        return timestamp;
    }

    return _console;
};