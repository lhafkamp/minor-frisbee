const done = document.querySelector('.done');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input');
const numbers = document.querySelectorAll('#score p');
const leftVotes = document.querySelectorAll('#score div:first-of-type button');
const rightVotes = document.querySelectorAll('#score div:last-of-type button');

// start out with 0
let leftNumber = 0;
let rightNumber = 0;
numbers[0].innerHTML = leftNumber;
numbers[2].innerHTML = rightNumber;

// fill in form when done
function fillInForm() {
	inputs[0].value = numbers[0].textContent;
	inputs[1].value = numbers[2].textContent;
	form.classList.remove('hide');
}

done.addEventListener('click', fillInForm);

// change number on vote
function votingA(e) {
	if (this.textContent === '+1') {
		if (leftNumber < 15) {
			leftNumber++;
			numbers[0].innerHTML = leftNumber;
		}
	} else {
		if (leftNumber > 0) {
			leftNumber--;
			numbers[0].innerHTML = leftNumber;
		}
	}
}

// change number on vote
function votingB(e) {
	if (this.textContent === '+1') {
		if (rightNumber < 15) {
			rightNumber++;
			numbers[2].innerHTML = rightNumber;
		}
	} else {
		if (rightNumber > 0) {
			rightNumber--;
			numbers[2].innerHTML = rightNumber;
		}
	}
}

leftVotes.forEach(vote => vote.addEventListener('click', votingA));
rightVotes.forEach(vote => vote.addEventListener('click', votingB));
