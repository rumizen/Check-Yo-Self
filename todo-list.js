class ToDoList {

	constructor(id, title, urgent, tasks) {
		this.id = id;
		this.title = title;
		this.urgent = false;
		this.tasks = tasks || [];
	}

	saveToStorage(allTodos) {
		localStorage.setItem('storedTodos', JSON.stringify(allTodos));
	}

	deleteFromStorage(index) {
		allTodos.splice(index, 1);
		this.saveToStorage(allTodos);
	}

	updateToDo(click) {
		if (click.matches('.todo-card__top--title')) {
			this.title = click.innerText;
		}
		if (click.matches('.todo-card__bottom__icon--urgent')) {
			this.urgent = !this.urgent;
		}
		this.saveToStorage(allTodos);
	}

	updateTask(click, taskIndex) {
		if (click.matches('.todo-card__middle--task--text')) {
			this.tasks[taskIndex].content = click.innerText;
		}
		if (click.matches('.todo-card__middle--task--checkbox')) {
			this.tasks[taskIndex].checked = !this.tasks[taskIndex].checked;
		}
		this.saveToStorage(allTodos);
	}
}