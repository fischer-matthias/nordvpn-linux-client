module.exports = function () {

    var _dom = {};

    function returnDOM(id) {
        return document.getElementById(id);
    }

    _dom.getUser = function () { return returnDOM('user') };
    _dom.getPass = function () { return returnDOM('pass'); };
    _dom.getServerSelection = function () { return returnDOM('server'); };
    _dom.getStatus = function () { return returnDOM('status'); };
    _dom.getFile = function () { return returnDOM('file'); };
    _dom.getOS = function () { return returnDOM('os'); };
    _dom.getLogList = function () { return returnDOM('log-list'); };
    _dom.getOptions = function () { return returnDOM('options'); };
    _dom.getSaveCredentials = function () { return returnDOM('saveCredentials'); };
    _dom.getUdp = function () { return returnDOM('udp'); };
    _dom.getTcp = function () { return returnDOM('tcp'); };
    _dom.getConnect = function () { return returnDOM('connect'); };
    _dom.getDisconnect = function () { return returnDOM('disconnect'); };

    return _dom;
};