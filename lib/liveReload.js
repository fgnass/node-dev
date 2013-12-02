'use strict';
var http = require('http');

// don't propagate possible ex variable - use iffy
var WebSocketServer = (function() {
    try {
        return require('ws').Server;
    } catch (ex) { }
}());

/*
 * returns new WebSocketServer or undefined if WebSocketServer is unavailable
 */
function createWebSocketServer(options) {
    var wss;
    if (WebSocketServer !== undefined) {
        options = options || {};
        options.path = options.path || '/livereload';
        options.port = options.port || 35729;
        wss = new WebSocketServer(options);
    }
    return wss;
}

var PROTOCOLS = [
    'http://livereload.com/protocols/official-7',
    'http://livereload.com/protocols/2.x-remote-control'
];

function pushUnique(to, what) {
    for (var i = 0; i < what.length; ++i) {
        if (to.indexOf(what[i]) === -1) {
            to.push(what[i]);
        }
    }
    return to;
}

module.exports = function (options) {

    var connections = [];

    function onConnection(ws) {
        console.log('connection');
        function onMessage(msgString, flag) {
            console.log('message');
            try { var msg = JSON.parse(msgString); } catch (ex) { }
            if (msg && msg.command === 'hello') {
                var handshake = {
                    command: 'hello',
                    protocols: Object.prototype.toString.call(msg.protocols) === '[object Array]'
                        ? pushUnique(msg.protocols, PROTOCOLS)
                        : PROTOCOLS.slice(0),
                    serverName: 'node-dev-livereload'
                };
                console.log(handshake);
                ws.send(JSON.stringify(handshake));
                // add to connections AFTER handshake sent
                // and only if it's not there yet
                if (connections.indexOf(ws === -1)) {
                    connections.push(ws);
                }
            }
        }
        function onClose() {
            console.log('close');
            connections.splice(connections.indexOf(ws, 1));
        }
        ws.on('message', onMessage);
        ws.on('close', onClose);
    }

    options = options || {};
    var wsServer = options.wsServer || createWebSocketServer(options);
    if (wsServer) {
        wsServer.on('connection', onConnection);
        wsServer.broadcast = function (command) {
            console.log('broadcast');
            var data = JSON.stringify({
                command: command

                //path: path,
                //liveCSS: false,
                //liveImg: false
            });
            for (var i = 0; i < wsServer.clients.length; ++i) {
                console.log('to: ' + i)
                wsServer.clients[i].send(data);
            }
        };
    }

    return wsServer;
};