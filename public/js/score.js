const done = document.querySelector('.done');
const inputs = document.querySelectorAll('form input');
const numbers = document.querySelectorAll('#score p');

function fillInForm() {
	inputs[0].value = numbers[0].textContent;
	inputs[1].value = numbers[1].textContent;
}

done.addEventListener('click', fillInForm);
