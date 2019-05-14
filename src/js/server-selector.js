var domManipulator = require('./dom-manipulator')(config);

module.exports = function () {
    var _selector = {};
    var _config = config;
    var _os = require('os');
    _selector.countries = [];

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
                    domManipulator.getServerSelection().appendChild(option);
                }
            }
        };

        request.send();
    }

    _selector.loadCountryInfo = function (id) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://nordvpn.com/wp-admin/admin-ajax.php?action=servers_recommendations&filters={%22country_id%22:' + id + '}');
        request.onreadystatechange = function () {

            if (request.readyState === 4) {
                servers = JSON.parse(request.responseText);
                if (servers !== null && servers !== undefined
                    && servers[0] !== null && servers[0] !== undefined
                    && servers[0].hostname !== null && servers[0].hostname !== undefined) {
                    var udp_tcp = _config.config.udp_tcp;
                    domManipulator.getFile().value = `${_os.homedir}/.nordvpn-client/ovpn/ovpn_${udp_tcp}/${servers[0].hostname}.${udp_tcp}.ovpn`;
                }
            }
        };

        request.send();
    }

    loadCountries();
    return _selector;
}