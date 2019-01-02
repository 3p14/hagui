const { ipcRenderer } = require('electron');
const Identicon = require('./identicon');

var data = {
    title: 'Home Assistant',
    services: []
};

var app = new Vue({
    el: '#app',
    data: data
});

ipcRenderer.on('serviceUp', (event, service) => {
    console.log(service);
    service.icon = 'data:image/png;base64,' + new Identicon(service.hash).toString();
    data.services.push(service);
});