const io = require('socket.io-client');
const socket = io.connect();
const start = document.querySelector('.start');
const timer = document.querySelector('.timer');
const votes = document.querySelectorAll('#score div button');
const numbers = document.querySelectorAll('#score p');
const leftPercentage = document.querySelector('.leftPrc');
const rightPercentage = document.querySelector('.rightPrc');

// get the unique game number from the URL
const location = window.location.href;
const locationIndex = location.indexOf('/score/');
const params = location.slice(locationIndex + 7);

// create socket room
socket.emit('create', params);

socket.on('startVoting', () => {
	// remove eventual scoreUpdate classes
	numbers[0].classList.remove('scoreUpdate');
	numbers[2].classList.remove('scoreUpdate');

	// enable voting options
	votes.forEach(vote => vote.disabled = false);
});

socket.on('endVoting', () => {
	// disable voting options
	votes.forEach(vote => vote.disabled = true);
});

socket.on('timeStarted', counter => {
	// small logic for a better visual experience
	// let visual = 1;
	// if (counter < 14) {
	// 	visual = 0;
	// }
	// timer.value = counter + visual;

	// TODO test if this is a better progress option
	document.querySelector('.test span').classList.add('countdown');
	if (counter < 1) {
		document.querySelector('.test span').classList.remove('countdown');
	}
});

socket.on('leftVoteResult', score => {
	// set score
	numbers[0].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;

	// add score update animation and remove percentage colors
	numbers[0].classList.add('scoreUpdate');
	leftPercentage.classList.remove('green');
});

socket.on('rightVoteResult', score => {
	numbers[2].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;

	numbers[2].classList.add('scoreUpdate');
	rightPercentage.classList.remove('green');
});

socket.on('percentage', obj => {
	leftPercentage.innerHTML = obj.leftPercentage;
	rightPercentage.innerHTML = obj.rightPercentage;

	// change percentage box color based on the percentage
	if (obj.leftPercentage > 50) {
		leftPercentage.classList.add('green');
	} else if (obj.rightPercentage > 50) {
		rightPercentage.classList.add('green');
	} else {
		leftPercentage.classList.remove('green');
		rightPercentage.classList.remove('green');
	}
});

// start time event on click
function sendEvent() {
	socket.emit('timeEvent');
}

// send vote to the server
function sendScore() {
	if (this === votes[0]) {
		scoreObj = {
			leftUpVotes: 1
		}
		socket.emit('upVote', scoreObj);
	} else {
		scoreObj = {
			rightUpVotes: 1
		}
		socket.emit('upVote', scoreObj);
 	}
}

start.addEventListener('click', sendEvent);
votes.forEach(vote => vote.addEventListener('click', sendScore));
