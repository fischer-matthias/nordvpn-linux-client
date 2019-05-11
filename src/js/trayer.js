module.exports = function (electron) {
    var _trayer = {};

    _trayer.tray = null;

    _trayer.create = function () {
        _trayer.tray = new electron.Tray(`${__dirname}/img/icon.jpg`);
        var contextMenu = electron.Menu.buildFromTemplate([
            { label: 'Item1', type: 'radio' },
            { label: 'Item2', type: 'radio' },
            { label: 'Item3', type: 'radio', checked: true },
            { label: 'Item4', type: 'radio' }
        ]);
        _trayer.tray.setToolTip('This is my application.');
        _trayer.tray.setContextMenu(contextMenu);
    }

    return _trayer;
}