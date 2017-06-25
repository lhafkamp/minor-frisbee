var done = document.querySelector('.done');
var form = document.querySelector('form');
var inputs = document.querySelectorAll('form input');
var numbers = document.querySelectorAll('#score p');
var votingOptions = document.querySelectorAll('#score div');
var scoreContent = document.querySelector('container');
var startButton = document.querySelector('.start');
var progress = document.querySelector('.progress');
var shirtColors = document.querySelector('#shirts');
var colorInputs = document.querySelectorAll('#shirts input');

// hide the input value if type="color" is not supported
colorInputs.forEach(function(input) {
	if (input.type === 'color') {
		input.classList.remove('hide');
	} else {
		input.value = null;
	}
});

// show content when/if JS loads (PE)
startButton.classList.remove('hide');
progress.classList.remove('hide');
votingOptions.forEach(function(option) {
	return option.classList.remove('hide');
});

// fill in form when done
function fillInForm() {
	inputs[0].value = numbers[0].textContent;
	inputs[1].value = numbers[2].textContent;
	form.classList.remove('hide');
	scoreContent.classList.add('hide');
	form.classList.add('swap');
}

done.addEventListener('click', fillInForm);
