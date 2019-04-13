class ToDoList {

	constructor() {
		this.id = date.now()
		this.title = string
		this.urgent = boolean
		this.tasks = []
	}

	saveToStorage() {
		localStorage.setItem(JSON.stringify(allTodos));
	}

	deleteFromStorage(index) {
		allTodos.splice(index, 1);
		this.saveToStorage;
	}

	updateToDo(click) {
		if (click.matches('.todo-card__top--title')) {
			this.title = click.innerText;
		}
		if (click.matches('.todo-card__bottom__icon--urgent')) {
			this.urgent = !this.urgent;
		}
		this.saveToStorage;
	}

	updateTask(click, taskObject) {
		if (click.matches('.todo-card__middle--task')) {
			taskObject.content = click.innerText;
		}
		if (click.matches('.todo-card__checkbox')) {
			taskObject.complete = !taskObject.complete;
		}
		this.saveToStorage;
	}
}