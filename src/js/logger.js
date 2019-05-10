var domManipulator = require('./dom-manipulator')();

module.exports = function (dom) {

    var _console = {};

    function generateTimestamp() {
        return new Date().toISOString() + ': ';
    }

    function log(msg) {
        console.log(generateTimestamp() + msg);
        domManipulator.value = domManipulator.value + msg + '\n';
    }

    _console.append = function (msg) {
        log(msg);
    };

    _console.clear = function () {
        console.log(generateTimestamp() + 'Clear logs');
        domManipulator.value = '';
    }

    return _console;
};