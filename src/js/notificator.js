module.exports = function () {
    var _notificator = {};

    _notificator.message = function (title, message) {
        new Notification(`(UO) Nordvpn Client - ${title}`, {
            body: message
        });
    };

    return _notificator;
}