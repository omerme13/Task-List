const taskList = document.querySelector('.curr-tasks');
const finishedTaskList = document.querySelector('.finished-tasks');
const addButton = document.querySelector('.add-task');
const clearButton = document.querySelector('.clear-tasks');
const filterInput = document.querySelector('#filter-input');
const taskInput = document.querySelector('#user-input');

/* ----------------------------- */
/* ----- HELPING FUNCTIONS ----- */
function addIconToTask(listItem) {
    const icon = document.createElement('a');
    icon.className = 'ion-trash-a delete-task icon-delete icons';
    listItem.appendChild(icon);
}

function addTask(listName, content) {
    const li = document.createElement('li');

    li.appendChild(document.createTextNode(content));
    addIconToTask(li);
    listName.appendChild(li);
}

function initTasksInLS(tasks) {
    if (localStorage.getItem('tasks') === null) {
        return tasks = [];
    } else {
        return tasks = JSON.parse(localStorage.getItem('tasks'));
    }
}

function initFinishedTasksInLS(finishedTasks) {
    if (localStorage.getItem('finishedTasks') === null) {
        return finishedTasks = [];
    } else {
        return finishedTasks = JSON.parse(localStorage.getItem('finishedTasks'));
    }
}

function removeTaskFromLS(task) {
    let tasks;

    tasks = initTasksInLS(tasks);
    tasks.forEach(function(taskItem, index) {
        if (task.textContent === taskItem) {
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeFinishedTaskFromLS(task) {
    let finishedTasks;

    finishedTasks = initFinishedTasksInLS(finishedTasks);
    finishedTasks.forEach(function(taskItem, index) {
        if (task.textContent === taskItem) {
            finishedTasks.splice(index, 1);
        }
    });
    localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
}

function storeInLS(task) {
    let tasks;

    tasks = initTasksInLS(tasks);
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToTaskList() {
    addTask(taskList, taskInput.value);
    storeInLS(taskInput.value);
    taskInput.value = '';
}

function addTaskToFinished(task) {
    addTask(finishedTaskList, task.textContent);
}

/* ----------------------------- */

function addAfterClick() {
    if (taskInput.value.length > 0) {
        addTaskToTaskList();
    }
}

function addAfterKeyPress() {
    if (taskInput.value.length > 0 && event.which == 13) {
        addTaskToTaskList();
    }
}

function deleteListItem(e) {
    const task = e.target;

    if (task.parentElement.classList.contains('curr-tasks')) {
        let finishedTasks;

        addTaskToFinished(task);
        removeTaskFromLS(task);
        finishedTasks = initFinishedTasksInLS(finishedTasks);
        finishedTasks.push(task.textContent);
        localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
        task.remove();
    }

    if (task.classList.contains('icon-delete')) {
        if (task.parentElement.parentElement.classList.contains('curr-tasks')) {
            removeTaskFromLS(task.parentElement);
        }
        else {
            removeFinishedTaskFromLS(task.parentElement);
        }
        task.parentElement.remove();
    }
}

function clearFinished() {
    while (finishedTaskList.firstChild) {
        removeFinishedTaskFromLS(finishedTaskList.firstChild);
        finishedTaskList.removeChild(finishedTaskList.firstChild);
    }
}

function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('li').forEach(function(task) {
        const item = task.firstChild.textContent;

        if (item.toLowerCase().indexOf(text) > -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function getTasks() {
    let tasks, finishedTasks;

    tasks = initTasksInLS(tasks);
    finishedTasks = initFinishedTasksInLS(finishedTasks);

    tasks.forEach(function(task) {
        addTask(taskList, task);
    });
    finishedTasks.forEach(function(task) {
        addTask(finishedTaskList, task);
    });
}

function loadEventListeners() {
    addButton.addEventListener('click', addAfterClick);
    taskInput.addEventListener('keypress', addAfterKeyPress);
    taskList.addEventListener('click', deleteListItem);
    finishedTaskList.addEventListener('click', deleteListItem);
    clearButton.addEventListener('click', clearFinished);
    filterInput.addEventListener('keyup', filterTasks);
    document.addEventListener('DOMContentLoaded', getTasks);
}

loadEventListeners();
