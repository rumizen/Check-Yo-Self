/* ---------- Query Selectors ---------- */


const searchBar = document.querySelector('.header--search__input');
const taskTitle = document.querySelector('.form__input--task-title');
const taskItem = document.querySelector('.form__input--task-item');
const taskItemBtn = document.querySelector('.form__input--task-item--button');
const makeTaskListBtn = document.querySelector('.form__button--make-task-list');
const clearAllBtn = document.querySelector('.form__button--clear-all');
const filterByUrgencyBtn = document.querySelector('.form__button--filter-by-urgency');
const main = document.querySelector('main');
const taskList = document.querySelector('.form__task-item-list');
const emptyMessage = document.querySelector('h3');


/* -------------- Global Variables ------------- */


var allTodos = JSON.parse(localStorage.getItem('storedTodos')) || [];


/* -------------- Event Listeners ------------- */


window.addEventListener('load', startCheckYoSelf);
taskItem.addEventListener('input', inputChecker);
taskTitle.addEventListener('input', inputChecker);
taskItemBtn.addEventListener('click', createTask);
makeTaskListBtn.addEventListener('click', createNewTodo);
main.addEventListener('click', todoButtons);
clearAllBtn.addEventListener('click', clearForms);
taskList.addEventListener('click', deleteStagedTask);
searchBar.addEventListener('input', searchTodos);
// filterByUrgencyBtn.addEventListener('click',);


/* -------------- On Load Fuctions ------------- */


function startCheckYoSelf() {
	disableButton(makeTaskListBtn);
	disableButton(clearAllBtn);
	disableButton(taskItemBtn);
	reinstantiateTodos(allTodos);
	loadTodos();
	emptyTodoMessage();
}

function emptyTodoMessage() {
	allTodos.length < 1 ? emptyMessage.classList.remove('hide') : emptyMessage.classList.add('hide');
}


function enableButton(btn) {
	btn.removeAttribute('disabled');
}

function disableButton(btn) {
	btn.setAttribute('disabled', '');
}

function resetInput(input, btn) {
	input.value = '';
	disableButton(btn);
}

function clearForms() {
	taskTitle.value = '';
	taskList.innerHTML = '';
	disableButton(clearAllBtn);
	disableButton(makeTaskListBtn);
}

function reinstantiateTodos(todos) {
	allTodos = [];
	todos.forEach(function(todo) {
		let newTodo = new ToDoList(todo.id, todo.title, todo.urgent, todo.tasks);
		allTodos.push(newTodo);
	})
}

function loadTodos() {
	allTodos.forEach(function(el) {
		appendTodo(el);
	});
}

function inputChecker() {
	if (taskItem.value === '' || taskTitle.value === '') {
		disableButton(taskItemBtn);
		disableButton(makeTaskListBtn);
	} else {
		enableButton(taskItemBtn);
		enableButton(makeTaskListBtn);
		enableButton(clearAllBtn);
	}
}




/* ---------- Appending Cards ---------- */


function appendTodo(newTodo) {
	if (newTodo.urgent === false) {
		pasteCardNormal(newTodo);
	}
	if (newTodo.urgent === true) {
		pasteCardUrgent(newTodo);
	}
	newTodo.tasks.forEach(function(el) {
		if (el.checked === false) {
			pasteTasksNormal(el);
		} else {
			pasteTasksChecked(el);
		}			
	});
}

function createNewTodo(e) {
	e.preventDefault();
	const taskArray = Array.prototype.slice.call(document.querySelectorAll('.task-item__text'));
	const taskObjArray = taskArray.map(el => el = {id: el.dataset.id, content: el.innerText, checked: false});
	const newTodo = new ToDoList(Date.now(), taskTitle.value, false, taskObjArray);
	appendTodo(newTodo);
	allTodos.push(newTodo);
	emptyTodoMessage();
	newTodo.saveToStorage(allTodos);
	clearForms();
}

function createTask(e) {
	e.preventDefault();
	const task = `
	<div class="task-item">
		<img class="task-item__icon--delete" src="images/delete.svg">
		<p class="task-item__text" data-id=${Date.now()}>${taskItem.value}</p>
	</div>`;
	taskList.insertAdjacentHTML('beforeend', task);
	resetInput(taskItem, taskItemBtn);
}

function pasteCardNormal(newTodo) {
	const cardText = `
		<article class="todo-card" data-id=${newTodo.id}>
			<section class="todo-card__top flex">
				<h2 class="todo-card__top--title">${newTodo.title}</h2>
			</section>
			<section class="todo-card__middle flex">
			</section>
			<section class="todo-card__bottom flex">
				<div class="todo-card__bottom__icon todo-card__bottom__icon--urgent flex">
					<img class="todo-card__bottom--urgent" src="images/urgent.svg">
					<p>Urgent</p>
				</div>
				<div class="todo-card__bottom__icon todo-card__bottom__icon--delete flex">
					<img class="todo-card__bottom--delete" src="images/delete.svg">
					<p>Delete</p>
				</div>
			</section>
		</article>`;
		main.insertAdjacentHTML('afterbegin', cardText);
}

function pasteCardUrgent(newTodo) {
	const cardTextActive = `
		<article class="todo-card--active todo-card" data-id=${newTodo.id}>
			<section class="todo-card__top flex">
				<h2 class="todo-card__top--title">${newTodo.title}</h2>
			</section>
			<section class="todo-card__middle flex">
			</section>
			<section class="todo-card__bottom flex">
				<div class="todo-card__bottom__icon todo-card__bottom__icon--urgent flex">
					<img class="todo-card__bottom--urgent" src="images/urgent-active.svg">
					<p>Urgent</p>
				</div>
				<div class="todo-card__bottom__icon todo-card__bottom__icon--delete flex">
					<img class="todo-card__bottom--delete" src="images/delete.svg">
					<p>Delete</p>
				</div>
			</section>
		</article>`;
		main.insertAdjacentHTML('afterbegin', cardTextActive);
}

function pasteTasksNormal(el) {
	document.querySelector('.todo-card__middle').insertAdjacentHTML('beforeend', `
			<div class="todo-card__middle--task flex" data-id=${el.id}>
				<img class="todo-card__middle--task--checkbox" src="images/checkbox.svg">
				<p class="todo-card__middle--task--text">${el.content}</p>
			</div>`);
}

function pasteTasksChecked(el) {
	document.querySelector('.todo-card__middle').insertAdjacentHTML('beforeend', `
			<div class="todo-card__middle--task flex task-checked" data-id=${el.id}>
				<img class="todo-card__middle--task--checkbox" src="images/checkbox-active.svg">
				<p class="todo-card__middle--task--text">${el.content}</p>
			</div>`);
}


/* ---------- Updating DOM ---------- */


function getIndex(cardId) {
	cardIndex = allTodos.findIndex(function(el) {
		return el.id == cardId;
	})
	return cardIndex;
}

function todoButtons(e) {
	const click = e.target;
	const cardId = click.parentNode.parentNode.parentNode.dataset.id;
	const cardIndex = getIndex(cardId);
	if (click.matches('.todo-card__bottom--delete')) {
		deleteButton(click, cardIndex);
	}
	if (click.matches('.todo-card__bottom--urgent')) {
		urgentButton(click, cardIndex);
	}
	if (click.matches('.todo-card__middle--task--checkbox')) {
		taskCheckbox(click, cardIndex);
	}
}

function deleteButton(click, cardIndex) {
	const todoObject = allTodos[cardIndex];
	const checkedTasks = todoObject.tasks.filter(el => el.checked === true);
	if (todoObject.tasks.length === checkedTasks.length) {
		click.parentNode.parentNode.parentNode.parentNode.removeChild(click.parentNode.parentNode.parentNode);
		todoObject.deleteFromStorage(cardIndex);
	}
	emptyTodoMessage();
}

function deleteStagedTask(e) {
	if (e.target.matches('.task-item__icon--delete')) {
		e.target.parentNode.parentNode.removeChild(e.target.parentNode);
	}
}

function urgentButton(click, cardIndex) {
	const todoObject = allTodos[cardIndex];
	if (todoObject.urgent === false) {
		click.setAttribute('src', 'images/urgent-active.svg');
		click.parentNode.parentNode.parentNode.classList.add('todo-card--active');
	}
	if (todoObject.urgent === true) {
		click.setAttribute('src', 'images/urgent.svg');
		click.parentNode.parentNode.parentNode.classList.remove('todo-card--active');
	}
	todoObject.updateToDo(click);
}

function updateCheckbox(click, taskObject) {
	if (taskObject.checked === false) {
		click.setAttribute('src', 'images/checkbox-active.svg');
		click.parentNode.classList.add('task-checked');
		click.classList.add('checkbox-checked');
	}
	if (taskObject.checked === true) {
		click.setAttribute('src', 'images/checkbox.svg');
		click.parentNode.classList.remove('task-checked');
		click.classList.remove('checkbox-checked');
	}
}

function taskCheckbox(click, cardIndex) {
	const todoObject = allTodos[cardIndex];
	const taskId = click.parentNode.dataset.id;
	const taskIndex = todoObject.tasks.findIndex(el => el.id === taskId);
	const taskObject = todoObject.tasks[taskIndex];
	updateCheckbox(click, taskObject);
	todoObject.updateTask(click, taskIndex);
}


/* ---------- Filtering and Searching ---------- */


function searchTodos() {
  const searchQuery = searchBar.value.toLowerCase();
  const searchResults = allTodos.filter(card => card.title.toLowerCase().includes(searchQuery));
  main.innerHTML = '';
  searchResults.forEach(card => appendTodo(card));
}

