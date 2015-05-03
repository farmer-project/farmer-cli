'use strict';

function Terminal() {
}

Terminal.prototype.show = function (data) {
    if (data['type'] === 'notify') {
        console.log('in type part', data['type']);
        if (data['tag'] === 'START_FLAG_UP')
            subLevel++;
        if (data['tag'] === 'START_FLAG_DOWN')
            subLevel--;

        console.log('subLevel', subLevel);
    }

    if (subLevel < 0) {
        listener.disconnect();
    } else {
        console.log('data', data);
        if (data['type'] === 'message') {
            var tab = '    ';
            for (var i=0; i<subLevel; i++) {
                tab += tab;
            }
            delete data['type'];
            console.log(tab + ' * ' ,data);
        }

        if (data['type'] === 'file') {

        }
    }
};

module.exports = new Terminal();
