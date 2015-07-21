/*jshint node:true */
'use strict';

if (process.argv.length < 3) {
    console.log ('usage: node ping <target> [<target> ...]');
    process.exit (-1);
}

var ping = require('net-ping');
var displayNotification = require('display-notification');

var session = ping.createSession({ packetSize: 56 });

var notif = function(msg) {
    displayNotification({
        title: 'Server Info',
        text: msg,
        sound: 'Submarine'
    });
};

var pingloop = function(target, laststate) {
    session.pingHost(target, function(error, target) {
        error = error ? error.toString() : undefined;
        if (laststate !== error) {
            if (error) {
                console.log(target + ': ' + error);
                notif(target + ': ' + error);
            } else {
                console.log(target + ': Alive');
                notif(target + ': Alive');
            }
        }
        setTimeout(pingloop.bind(null, target, error), 2000);
    });
};

process.argv.slice(2).map(function(ip) {
    pingloop(ip);
});
