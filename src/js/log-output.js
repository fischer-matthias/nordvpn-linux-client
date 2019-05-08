module.exports = function (dom) {

    var _console = {};
    var _dom = dom;

    function generateTimestamp() {
        return new Date().toISOString() + ': ';
    }

    function log(msg) {
        console.log(generateTimestamp() + msg);
        _dom.value = _dom.value + msg + '\n';
    }

    _console.append = function (msg) {
        log(msg);
    };

    _console.clear = function () {
        console.log(generateTimestamp() + 'Clear logs');
        _dom.value = '';
    }

    return _console;
};