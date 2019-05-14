var is = require('electron-is');

////////////// Own Objects
var logger = require('./js/logger')();
var notificator = require('./js/notificator')();
var domManipulator = require('./js/dom-manipulator')();

////////////// File-Things
var config = require('./js/config')();
var ndownloader = require('./js/nordvpn-downloader')();
var cfc = require('./js/credentials-file-creator')();

config.readConfigFile(function () {
    console.log(`Config loaded ...`);
    if (config.config.saveCredentials) {

        domManipulator.getSaveCredentials().checked = true;

        cfc.read(function (cred) {
            domManipulator.getUser().value = cred.user;
            domManipulator.getPass().value = cred.pass;
        });
    }

    if (config.config.udp_tcp == 'udp') {
        domManipulator.getUdp().checked = true;
        domManipulator.getTcp().checked = false;
    } else {
        domManipulator.getUdp().checked = false;
        domManipulator.getTcp().checked = true;
    }

    ndownloader.check();
});

////////////// RunTime
var serverSelector = require('./js/server-selector')();
var processExecuter = require('./js/process-executer')(config, cfc);

//////////////////////////
////////////// DOM-Handler
//////////////////////////
function onServerSelected(id) {
    if (id !== null && id !== undefined && id !== -1) {
        serverSelector.loadCountryInfo(id);
    }
};

function onCreateProcessClicked() {
    if (is.linux()) {
        var configFile = domManipulator.getFile().value;
        var user = domManipulator.getUser().value;
        var pass = domManipulator.getPass().value;

        cfc.create(user, pass, function (success) {
            if (success) {
                if (user != '' && pass != '' && configFile != '') {
                    processExecuter.start(configFile, cfc.filePath);
                } else {
                    notificator.message('Error!', 'Please fill in your credentials and select a server.');
                }
            } else {
                notificator.message(`Error!`, `Unable to create the credential-file.`);
            }
        });

    } else {
        notificator.message('Error!', 'Linux only!');
    }
};

function onKillProcessClicked() {
    processExecuter.stop();
};

function onClearlogClicked() {
    logger.clear();
};

function onSaveConfigClicked() {
    if (domManipulator.getSaveCredentials().checked) {
        config.config.saveCredentials = true;
    } else {
        config.config.saveCredentials = false;
    }

    if (domManipulator.getUdp().checked && !domManipulator.getTcp().checked) {
        config.config.udp_tcp = 'udp';
    } else if (!domManipulator.getUdp().checked && domManipulator.getTcp().checked) {
        config.config.udp_tcp = 'tcp';
    } else {
        config.config.udp_tcp = 'udp';
    }

    config.writeFile(function () {
        notificator.message('Saved!', `Config saved.`);
    });
};
