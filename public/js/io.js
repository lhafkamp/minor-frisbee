const io = require('socket.io-client');
const socket = io.connect();
const start = document.querySelector('.start');
const timer = document.querySelector('.timer');
const leftVotes = document.querySelectorAll('#score div:first-of-type button');
const numbers = document.querySelectorAll('#score p');

// send time event to the server
function sendEvent() {
	socket.emit('timeEvent');
	console.log('event to the server');
}

start.addEventListener('click', sendEvent);

// show time event to the clients
socket.on('timeStarted', () => {
	let counter = 10;
	let interval = setInterval(() => {
		counter -= 1;
		if (counter === 0) {
			socket.emit('voteEnd');
			clearInterval(interval);
		}
		timer.innerHTML = counter;
	}, 1000);
});

socket.on('voteResult', score => {
	numbers[0].innerHTML = score;
});

function sendScore() {
	if (this === leftVotes[0]) {
		socket.emit('upVote');
	} else {
		socket.emit('downVote');
 	}
}

leftVotes.forEach(vote => vote.addEventListener('click', sendScore));
