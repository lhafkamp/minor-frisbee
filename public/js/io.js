const io = require('socket.io-client');
const socket = io.connect();

socket.on('disconnect', () => {
	console.log('socket disconnected');
});
