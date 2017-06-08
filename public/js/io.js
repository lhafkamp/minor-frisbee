const io = require('socket.io-client');
const socket = io.connect();
const start = document.querySelector('.start');
const timer = document.querySelector('.timer');
const votes = document.querySelectorAll('#score div button');
const numbers = document.querySelectorAll('#score p');
const leftPercentage = document.querySelector('.leftPrc');
const rightPercentage = document.querySelector('.rightPrc');

const location = window.location.href;
const locationIndex = location.indexOf('/score/');
const params = location.slice(locationIndex + 7);

socket.emit('create', params);

// send time event to the server
function sendEvent() {
	socket.emit('timeEvent');
}

// show time event to the clients
socket.on('timeStarted', counter => {
	timer.innerHTML = counter;
});

socket.on('leftVoteResult', score => {
	numbers[0].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;
});

socket.on('rightVoteResult', score => {
	numbers[2].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;
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

socket.on('percentage', obj => {
	leftPercentage.innerHTML = obj.leftPercentage;
	rightPercentage.innerHTML = obj.rightPercentage;
});

start.addEventListener('click', sendEvent);
votes.forEach(vote => vote.addEventListener('click', sendScore));
