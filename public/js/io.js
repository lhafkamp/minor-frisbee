const io = require('socket.io-client');
const socket = io.connect();
const start = document.querySelector('.start');
const timer = document.querySelector('.timer');

// send time event to the server
function sendEvent() {
	socket.emit('timeEvent');
	console.log('event to the server');
}

// show time event to the clients
socket.on('timeStarted', data => {
	let counter = 10;
	let interval = setInterval(() => {
		counter -= 1;
		if (counter === 0) {
			clearInterval(interval);
		}
		timer.innerHTML = counter;
	}, 1000);
});

start.addEventListener('click', sendEvent);
