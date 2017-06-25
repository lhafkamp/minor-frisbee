var io = require('socket.io-client');
var socket = io.connect();
var start = document.querySelector('.start');
var timer = document.querySelector('.timer');
var votes = document.querySelectorAll('#score div button');
var scores = document.querySelectorAll('#score p');
var leftPercentage = document.querySelector('.leftPrc');
var rightPercentage = document.querySelector('.rightPrc');
var progress = document.querySelector('.progress span');
var error = document.querySelector('#error');
var voting = document.querySelector('.voting');
var colors = document.querySelectorAll('container input');
var teamBorders = document.querySelectorAll('#vs p');

// on server disconnect
socket.on('disconnect', function() {
	error.innerHTML = `
		<div class="overlay">
			<div class="alert">
				<h1>Server down</h1>
				<p>Try <a href="${window.location.href}">refreshing</a> the page or come back later!</p>
			</div>
		</div>
	`;
});

// poll if the client is still online
setInterval(function() {
	if (navigator.onLine === false && !window.location.href.includes('localhost')) {
		error.innerHTML = `
			<div class="overlay">
				<div class="alert">
					<h1>You seem to be offline</h1>
					<p>Try to reconnect and <a href="${window.location.href}">refresh</a> the page</p>
				</div>
			</div>
		`;
	}
}, 1000);

// get the unique game number from the URL
var location = window.location.href;
var locationIndex = location.indexOf('/score/');
var params = location.slice(locationIndex + 7);

// create socket room
socket.emit('create', params);

socket.on('startVoting', function () {
	// remove eventual scoreUpdate classes
	scores[0].classList.remove('scoreUpdate');
	scores[2].classList.remove('scoreUpdate');

	// enable voting options
	votes.forEach(function (vote) {
		return vote.disabled = false;
	});
	start.disabled = true;
});

socket.on('endVoting', function () {
	// disable voting options
	votes.forEach(function (vote) {
		return vote.disabled = true;
	});
});

socket.on('endEvent', function () {
	// enable start event button
	start.disabled = false;
	voting.classList.add('hide');
});

socket.on('timeStarted', function (counter) {
	// TODO test if this is a better progress option
	progress.classList.add('countdown');
	if (counter < 1) {
		progress.classList.remove('countdown');
	}
});

socket.on('leftVoteResult', function (score) {
	// set score
	scores[0].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;

	// add score update animation and remove percentage colors
	scores[0].classList.add('scoreUpdate');
	leftPercentage.classList.remove('green');
});

socket.on('rightVoteResult', function (score) {
	scores[2].innerHTML = score;
	leftPercentage.innerHTML = 0;
	rightPercentage.innerHTML = 0;

	scores[2].classList.add('scoreUpdate');
	rightPercentage.classList.remove('green');
});

socket.on('percentage', function (obj) {
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
		};
		socket.emit('upVote', scoreObj);
	} else {
		scoreObj = {
			rightUpVotes: 1
		};
		socket.emit('upVote', scoreObj);
	}
}

start.addEventListener('click', sendEvent);
votes.forEach(function (vote) {
	return vote.addEventListener('click', sendScore);
});

// send the team color to the server
function sendColor(e) {
	const obj = {
		side: this.dataset.side,
		team: this.name,
		color: this.value
	}
	socket.emit('shirtColor', obj);
}

// check which team was selected and update
socket.on('updateShirt', function(colorData) {
	document.querySelector("[data-side='" + colorData.side + "']").value = colorData.color;

	teamBorders.forEach(function(name) {
		if (name.textContent === colorData.team) {
			name.style.borderBottom = '2px solid ' + colorData.color;
		}
	});
});

colors.forEach(function (color) {
	return color.addEventListener('focus', sendColor);
});
