
var is = require('electron-is');
var dom = require('./js/dom')();

var logOutput = require('./js/log-output')(dom.getLogList());
var processExecuter = require('./js/process-executer')(__dirname);

var child = null;
var countries = [];

function loadCountries() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://nordvpn.com/wp-admin/admin-ajax.php?action=servers_countries');

    request.onreadystatechange = function () {

        if (request.readyState === 4) {

            countries = JSON.parse(request.responseText);
            for (var country of countries) {
                var option = document.createElement('option');
                option.innerHTML = country.name;
                option.value = country.id;
                dom.getServerSelection().appendChild(option);
            }
        }
    };

    request.send();
}

function showOS() {
    if (is.windows()) {
        dom.getOS().value = 'Windows';
    } else if (is.macOS()) {
        dom.getOS().value = 'Apple OS';
    } else if (is.linux()) {
        dom.getOS().value = 'Linux';
    }
}

function onServerSelected(id) {
    if (id !== null && id !== undefined && id !== -1) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://nordvpn.com/wp-admin/admin-ajax.php?action=servers_recommendations&filters={%22country_id%22:' + id + '}');
        request.onreadystatechange = function () {

            if (request.readyState === 4) {
                servers = JSON.parse(request.responseText);
                if (servers !== null && servers !== undefined
                    && servers[0] !== null && servers[0] !== undefined
                    && servers[0].hostname !== null && servers[0].hostname !== undefined) {
                    dom.getFile().value = '/etc/openvpn/ovpn_udp/' + servers[0].hostname + '.udp.ovpn';
                }
            }
        };

        request.send();
    }
}

function onCreateProcessClicked() {
    if (is.linux()) {
        var configFile = dom.getFile().value;
        var user = dom.getUser().value;
        var pass = dom.getPass().value;

        if (user != '' && pass != '' && configFile != '') {
            processExecuter.start(configFile, '/home/matse/Devel/nordvpn-linux-client/src/cr.tmp');
        } else {
            logOutput.append('Error: Please fill in your credentials and select a server.');
        }
    } else {
        logOutput.append('Error: Linux only!');
    }
};

function onKillProcessClicked() {
    if (processExecuter.stop() === 0) {
        logOutput.clear();
        dom.getStatus().value = 'Process stopped ...';
    }
};
