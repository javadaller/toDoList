import {sleep,createDiv,escapeHTML} from './fnc.js';

//init
let addTaskOpen=false;
let draggedItem = null;
const list=document.querySelector('#list');
const addTask=document.querySelector('#addTask');
const listContainer=document.querySelector('#listContainer');
const taskName=document.querySelector('#taskName');
const error=document.querySelector('#inputError');

//Add button
const addButton=document.querySelector('#listAddButton');

addButton.addEventListener('click', () => {
    if (!addTaskOpen) {
        addNewTask();
    }
})

//close button
const closeButton=document.querySelector('#addTaskClose');

closeButton.addEventListener('click', () => {
    if(addTaskOpen) {
        addTaskOpen=false;
        addTask.style.display='none';
        list.style.display='block';
        taskName.classList.remove('error');
        taskName.classList.add('noError');
        error.innerText='';
        taskName.value='';
    }
})

//confirm button
const confirmButton=document.querySelector('#confirmButton');

confirmButton.addEventListener('click', () => {
    confirmTask();
})

async function addNewTask() {
    addTaskOpen=true;
    list.style.display='none';
    await sleep(300);
    addTask.style.display='block';
}

async function confirmTask() {
    
    const name=escapeHTML(taskName.value);

    if(name.length<20) {

        addTaskOpen=false;
        addTask.style.display='none';

        //container
        const taskContainer=createDiv('li',listContainer,null,'task');

        //drag svg
        const taskDrag=createDiv('img',taskContainer,null,'svgDrag');
        taskDrag.src="assets/images/icons/draggable.svg";

        //task name
        const taskContainerName=createDiv('p',taskContainer,name,'taskName');

        //task check
        const taskCheck=createDiv('input',taskContainer,'taskCheck');
        taskCheck.type='checkbox';
        checkTask(taskCheck,taskContainerName);

        //task delete
        const taskDelete=createDiv('img',taskContainer,null,'svgDelete');
        taskDelete.src="assets/images/icons/remove.svg";
        deleteTask(taskContainer,taskDelete);

        taskName.value='';
        taskName.classList.remove('error');
        taskName.classList.add('noError');
        error.innerText='';
        await sleep(300);
        list.style.display='block';

    } else {
        taskName.classList.add('error');
        error.innerText='20 characters maximum';
    }
}

function deleteTask(parent,button) {
    button.addEventListener('click', () => {
        if (confirm("Are you sure to remove this task?")) {
            parent.remove();
        }
    })
}

function checkTask(checkbox,task) {
    checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            task.style.textDecoration='line-through';
            task.style.color='grey';
        } else {
            task.style.textDecoration='none';
            task.style.color='inherit';
        }
    })
}