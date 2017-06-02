const done = document.querySelector('.done');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input');
const numbers = document.querySelectorAll('#score p');

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
