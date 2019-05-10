
var is = require('electron-is');
var logger = require('./js/logger')();
var notificator = require('./js/notificator')();

var domManipulator = require('./js/dom-manipulator')();
var serverSelector = require('./js/server-selector')();
var processExecuter = require('./js/process-executer')();

function onServerSelected(id) {
    if (id !== null && id !== undefined && id !== -1) {
        serverSelector.loadCountryInfo(id);
    }
}

function onCreateProcessClicked() {
    if (is.linux()) {
        var configFile = domManipulator.getFile().value;
        var user = domManipulator.getUser().value;
        var pass = domManipulator.getPass().value;

        if (user != '' && pass != '' && configFile != '') {
            processExecuter.start(configFile, '/home/matse/Devel/nordvpn-linux-client/src/cr.tmp');
        } else {
            notificator.message('Error!', 'Please fill in your credentials and select a server.');
        }
    } else {
        notificator.message('Error!', 'Linux only!');
    }
};

function onKillProcessClicked() {
    if (processExecuter.stop() === 0) {
        logger.clear();
        domManipulator.getStatus().value = 'Process stopped ...';
        notificator.message('Status', 'Connection stopped!');
    }
};
