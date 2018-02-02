#!/usr/local/bin/node

'use strict';

const c = require('cli-color');
const displayNotification = require('display-notification');
const ping = require('net-ping');
const timestamp = require('time-stamp');

const servers = [
    '127.0.0.1'
];

if (process.argv.length < 3 && servers.length === 0) {
    console.log('usage: node ping <target> [<target> ...]');
    process.exit(-1);
}

const session = ping.createSession({packetSize: 56});
const notif = function(msg) {
    displayNotification({
        title: 'Server Info',
        text: msg,
        sound: 'Submarine'
    });
};
const pingloop = function(target, laststate) {
    session.pingHost(target, function(error, ip) {
        error = error ? error.toString() : error;
        if (laststate !== error) {
            var time = timestamp('YYYY-MM-DD HH:mm:ss');

            if (error) {
                console.log(c.white(time) + ' ' + c.whiteBright(ip) + ' ' + c.magenta(error));
                notif(ip + ': ' + error);
            } else {
                console.log(c.white(time) + ' ' + c.whiteBright(ip) + ' ' + c.green('Alive'));
                notif(ip + ': Alive');
            }
        }
        setTimeout(pingloop.bind(null, target, error), 2000);
    });
};

if (process.argv.slice(2).length) {
    process.argv.slice(2).forEach((ip) => {
        pingloop(ip);
    });
} else {
    servers.forEach((ip) => {
        pingloop(ip);
    });
}

