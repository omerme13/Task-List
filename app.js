const taskList = document.querySelector('.curr-tasks');
const finishedTaskList = document.querySelector('.finished-tasks');
const addButton = document.querySelector('.add-task');
const clearButton = document.querySelector('.clear-tasks');
const filteInput = document.querySelector('#filter-input');
const taskInput = document.querySelector('#user-input');

/* ----------------------------- */
/* ----- HELPING FUNCTIONS  ----- */
function AddIconToTask(listItem)
{
    const icon = document.createElement('a');
    icon.className = 'ion-trash-a delete-task icon-delete icons';
    listItem.appendChild(icon);
}

function AddTask(listName, content)
{
    const li = document.createElement('li');

    li.appendChild(document.createTextNode(content));
    AddIconToTask(li);
    listName.appendChild(li);
}

function InitTasksInLS(tasks)
{
    if (localStorage.getItem('tasks') === null)
        return tasks = [];
    else
        return tasks = JSON.parse(localStorage.getItem('tasks'));
}

function InitFinishedTasksInLS(finishedTasks)
{
    if (localStorage.getItem('finishedTasks') === null)
        return finishedTasks = [];
    else
        return finishedTasks = JSON.parse(localStorage.getItem('finishedTasks'));
}

function RemoveTaskFromLS(task)
{
    let tasks;

    tasks = InitTasksInLS(tasks);
    tasks.forEach(function(taskItem, index)
    {
        if (task.textContent === taskItem)
            tasks.splice(index, 1);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function RemoveFinishedTaskFromLS(task)
{
    let finishedTasks;

    finishedTasks = InitFinishedTasksInLS(finishedTasks);
    finishedTasks.forEach(function(taskItem, index)
    {
        if (task.textContent === taskItem)
            finishedTasks.splice(index, 1);
    });
    localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
}

function StoreInLS(task)
{
    let tasks;

    tasks = InitTasksInLS(tasks);
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function AddTaskToTaskList()
{
    AddTask(taskList, taskInput.value);
    StoreInLS(taskInput.value);
    taskInput.value = '';
}

function AddTaskToFinished(task)
{
    AddTask(finishedTaskList, task.textContent);
}

/* ----- HELPING FUNCTIONS  ----- */
/* ----------------------------- */

function AddAfterClick()
{
    if (taskInput.value.length > 0)
        AddTaskToTaskList();
}

function AddAfterKeyPress()
{
    if (taskInput.value.length > 0 && event.which == 13)
        AddTaskToTaskList();
}

function DeleteListItem(e)
{
    const task = e.target;

    if (task.parentElement.classList.contains('curr-tasks'))
    {
        let finishedTasks;

        AddTaskToFinished(task);
        RemoveTaskFromLS(task);
        finishedTasks = InitFinishedTasksInLS(finishedTasks);
        finishedTasks.push(task.textContent);
        localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
        task.remove();
    }

    if (task.classList.contains('icon-delete'))
    {
        if (task.parentElement.parentElement.classList.contains('curr-tasks'))
            RemoveTaskFromLS(task.parentElement);
        else
            RemoveFinishedTaskFromLS(task.parentElement);
        task.parentElement.remove();
    }
}

function ClearFinished()
{
    while (finishedTaskList.firstChild)
    {
        RemoveFinishedTaskFromLS(finishedTaskList.firstChild);
        finishedTaskList.removeChild(finishedTaskList.firstChild);
    }
}

function FilterTasks(e)
{
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('li').forEach(function(task)
    {
        const item = task.firstChild.textContent;

        if (item.toLowerCase().indexOf(text) > -1)
            task.style.display = 'flex';
        else
            task.style.display = 'none';
    });
}

function GetTasks()
{
    let tasks, finishedTasks;

    tasks = InitTasksInLS(tasks);
    finishedTasks = InitFinishedTasksInLS(finishedTasks);

    tasks.forEach(function(task)
    {
        AddTask(taskList, task);
    });
    finishedTasks.forEach(function(task)
    {
        AddTask(finishedTaskList, task);
    });
}

function loadEventListeners()
{
    addButton.addEventListener('click', AddAfterClick);
    taskInput.addEventListener('keypress', AddAfterKeyPress);
    taskList.addEventListener('click', DeleteListItem);
    finishedTaskList.addEventListener('click', DeleteListItem);
    clearButton.addEventListener('click', ClearFinished);
    filteInput.addEventListener('keyup', FilterTasks);
    document.addEventListener('DOMContentLoaded', GetTasks);
}

loadEventListeners();
