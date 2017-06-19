const done = document.querySelector('.done');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input');
const numbers = document.querySelectorAll('#score p');
const scoreContent = document.querySelector('container');

// fill in form when done
function fillInForm() {
	inputs[0].value = numbers[0].textContent;
	inputs[1].value = numbers[2].textContent;
	form.classList.remove('hide');
	scoreContent.classList.add('hide');
	form.classList.add('swap');
}


done.addEventListener('click', fillInForm);
