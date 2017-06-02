const start = document.querySelector('.start');
const leftVotes = document.querySelectorAll('#score div:first-of-type button');
const rightVotes = document.querySelectorAll('#score div:last-of-type button');
const numbers = document.querySelectorAll('#score p');

let leftNumber = 0;
let rightNumber = 0;
leftVotes.disabled = true;
rightVotes.disabled = true;

function startEvent() {
	console.log('voting event started');
	leftVotes.disabled = false;
	rightVotes.disabled = false;

	let timesRun = 0;
	let interval = setInterval(() => {
	    timesRun += 1;
	    if(timesRun === 10){
	        clearInterval(interval);
	    }
	    document.querySelector('.timer').innerHTML = timesRun;
	}, 1000); 

	setTimeout(() => {
		console.log('result: ', document.querySelector('.leftPrc').textContent);
		if (document.querySelector('.leftPrc').textContent > 50) {
			leftNumber++;	
			numbers[0].innerHTML = leftNumber;
			console.log('vote passed!');
		} else {
			console.log('vote failed..');
		}
		console.log('voting event over');

		document.querySelector('.leftPrc').innerHTML = 0;
		document.querySelector('.rightPrc').innerHTML = 0;
	    document.querySelector('.timer').innerHTML = 0;
	}, 10000);

	// get the percentage of all clicks per score
	let leftSuccess = 0;
	let leftFailed = 0;
	let rightSuccess = 0;
	let rightFailed = 0;

	function votingA() {
		if (this === leftVotes[0]) {
			++leftSuccess;
			totalRate = leftSuccess + leftFailed;
			percentage = Math.round(leftSuccess / totalRate * 100);
			document.querySelector('.leftPrc').innerHTML = percentage;
		} else {
			++leftFailed;
			totalRate = leftSuccess + leftFailed;
			percentage = Math.round(leftSuccess / totalRate * 100);
			document.querySelector('.leftPrc').innerHTML = percentage;
		}
	}

	function votingB() {
		if (this === rightVotes[0]) {
			++rightSuccess;
			totalRate = rightSuccess + rightFailed;
			percentage = Math.round(rightSuccess / totalRate * 100);
			document.querySelector('.rightPrc').innerHTML = percentage;
		} else {
			++rightFailed;
			totalRate = rightSuccess + rightFailed;
			percentage = Math.round(rightSuccess / totalRate * 100);
			document.querySelector('.rightPrc').innerHTML = percentage;
		}
	}

	leftVotes.forEach(vote => vote.addEventListener('click', votingA));
	rightVotes.forEach(vote => vote.addEventListener('click', votingB));
}

start.addEventListener('click', startEvent);
