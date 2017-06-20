var done = document.querySelector('.done');
var form = document.querySelector('form');
var inputs = document.querySelectorAll('form input');
var numbers = document.querySelectorAll('#score p');
var votingOptions = document.querySelectorAll('#score div');
var scoreContent = document.querySelector('container');
var startButton = document.querySelector('.start');
var progress = document.querySelector('.progress');

// show content when/if JS loads (PE)
form.classList.add('hide');
done.classList.remove('hide');
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
