var WebSocket = require('ws');
var assert = require('assert');

var PORT = 38042;

// start the server
var clientHandler = require('../lib/wsClientHandler');
var server = new WebSocket.Server({ host: 'localhost', port: PORT });
server.on('connection', function (client) {
  clientHandler(server, client);
});

describe('Test ws-broadcast', function () {
	var c0, c1, c2;

	it('c0 should connect to the server', function (done) {
		c0 = new WebSocket('ws://localhost:' + PORT);
		c0.on('open', function () {
			done();
		});
	});

	it('c1 should connect to the server', function (done) {
		c1 = new WebSocket('ws://localhost:' + PORT);
		c1.on('open', function () {
			done();
		});
	});

	it('c2 should connect to the server', function (done) {
		c2 = new WebSocket('ws://localhost:' + PORT);
		c2.on('open', function () {
			done();
		});
	});

	it('c0 should send a message to all others clients', function (done) {
		var msg = 'foo';
		var received = 0;

		function closeTest() {
			if (received === 2) {
				server.close();
				done();
			}
		}

		c0.on('message', function (message) {
			throw new Error('c0 is not supposed to get an echo of the message "'+message+'"');
		});

		c1.on('message', function (message) {
			assert.strictEqual(message, msg, 'c1 message');
			received++;
			closeTest();
		});
		c2.on('message', function (message) {
			assert.strictEqual(message, msg, 'c2 message');
			received++;
			closeTest();
		});

		c0.send(msg);
	});
});
