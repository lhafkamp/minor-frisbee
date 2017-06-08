const io = require('socket.io-client');
const socket = io.connect();
const start = document.querySelector('.start');
const timer = document.querySelector('.timer');
const votes = document.querySelectorAll('#score div button');
const numbers = document.querySelectorAll('#score p');
const leftPercentage = document.querySelector('.leftPrc');

const location = window.location.href;
const locationIndex = location.indexOf('/score/');
const params = location.slice(locationIndex + 7);

socket.emit('create', params);

socket.on('event', () => {
	console.log('someone joined the room');
})

// send time event to the server
function sendEvent() {
	socket.emit('timeEvent');
	console.log('event to the server');
}

start.addEventListener('click', sendEvent);

// show time event to the clients
socket.on('timeStarted', counter => {
	timer.innerHTML = counter;
});

socket.on('voteResult', score => {
	numbers[0].innerHTML = score;
	leftPercentage.innerHTML = 0;
});

function sendScore() {
	if (this === votes[0]) {
		scoreObj = {
			leftUpVotes: 1,
			leftDownVotes: 0,
			rightUpVotes: 0,
			rightDownVotes: 0
		}
		socket.emit('upVote', scoreObj);
	} else if (this === votes[1]) {
		scoreObj = {
			leftUpVotes: 0,
			leftDownVotes: 1,
			rightUpVotes: 0,
			rightDownVotes: 0
		}
		socket.emit('downVote', scoreObj);
 	} else if (this === votes[2]) {
 		scoreObj = {
			leftUpVotes: 0,
			leftDownVotes: 0,
			rightUpVotes: 1,
			rightDownVotes: 0
		}
 		socket.emit('upVote', scoreObj);
 	} else {
 		scoreObj = {
			leftUpVotes: 0,
			leftDownVotes: 0,
			rightUpVotes: 0,
			rightDownVotes: 1
		}
		socket.emit('downVote', scoreObj);
 	}
}

socket.on('percentage', percentage => {
	leftPercentage.innerHTML = percentage;
});

votes.forEach(vote => vote.addEventListener('click', sendScore));
