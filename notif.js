#!/usr/bin/env node

'use strict';

const c = require('chalk');
const pkg = require('./package.json');
const ping = require('net-ping');
const program = require('commander');
const timestamp = require('time-stamp');
const displayNotification = require('display-notification');

const session = ping.createSession({packetSize: 56});
const notif = function(msg) {
    displayNotification({
        title: 'Server Info',
        text: msg,
        sound: 'Submarine'
    });
};
const pingloop = (target, laststate) => {
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

program
    .version(pkg.version)
    .description('Whatch for online status changes through macOS built-in notification center.')
    .usage('<ip ...>')
    .command('notif <ip> [ip...]');

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
} else {
    program.args.forEach((ip) => {
        pingloop(ip);
    });
}
