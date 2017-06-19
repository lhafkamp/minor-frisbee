var done = document.querySelector('.done');
var form = document.querySelector('form');
var inputs = document.querySelectorAll('form input');
var numbers = document.querySelectorAll('#score p');
var scoreContent = document.querySelector('container');

// fill in form when done
function fillInForm() {
	inputs[0].value = numbers[0].textContent;
	inputs[1].value = numbers[2].textContent;
	form.classList.remove('hide');
	scoreContent.classList.add('hide');
	form.classList.add('swap');
}

done.addEventListener('click', fillInForm);
