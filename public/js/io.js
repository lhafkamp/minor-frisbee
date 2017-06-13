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

socket.on('startVoting', () => {
	votes.forEach(vote => vote.disabled = false);
});

socket.on('endVoting', () => {
	votes.forEach(vote => vote.disabled = true);
});

socket.on('timeStarted', counter => {
	timer.innerHTML = counter;
});

socket.on('leftVoteResult', score => {
	numbers[0].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;
	leftPercentage.classList.remove('green');
});

socket.on('rightVoteResult', score => {
	numbers[2].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;
	rightPercentage.classList.remove('green');
});

socket.on('percentage', obj => {
	leftPercentage.innerHTML = obj.leftPercentage;
	rightPercentage.innerHTML = obj.rightPercentage;
	if (obj.leftPercentage >= 50) {
		leftPercentage.classList.add('green');
	} else if (obj.rightPercentage >= 50) {
		rightPercentage.classList.add('green');
	}
});

function sendEvent() {
	socket.emit('timeEvent');
}

function sendScore() {
	if (this === votes[0]) {
		scoreObj = {
			rightUpVotes: 0,
			leftUpVotes: 1
		}
		socket.emit('upVote', scoreObj);
	} else if (this === votes[1]) {
		scoreObj = {
			leftUpVotes: 0,
			leftDownVotes: 1
		}
		socket.emit('downVote', scoreObj);
 	} else if (this === votes[2]) {
 		scoreObj = {
 			leftUpVotes: 0,
			rightUpVotes: 1,
		}
 		socket.emit('upVote', scoreObj);
 	} else {
 		scoreObj = {
 			rightDownVotes: 0,
			rightDownVotes: 1
		}
		socket.emit('downVote', scoreObj);
 	}
}

start.addEventListener('click', sendEvent);
votes.forEach(vote => vote.addEventListener('click', sendScore));
