import {sleep,createList} from './fnc.js';

//init
const list=document.querySelector('#list');
const addTask=document.querySelector('#addTask');
const taskName=document.querySelector('#taskName');
const error=document.querySelector('#inputError');

//local storage
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
if(tasks!=null) {
    tasks.forEach(element => {
        createList(element.name,element.checked,false);
    });
}

//Add button
const addButton=document.querySelector('#listAddButton');

addButton.addEventListener('click', () => {
    addNewTask();
})

//close button
const closeButton=document.querySelector('#addTaskClose');

closeButton.addEventListener('click', () => {
    addTask.style.display='none';
    list.style.display='block';
    taskName.classList.remove('error');
    taskName.classList.add('noError');
    error.innerText='';
    taskName.value='';
})

//confirm button
const confirmButton=document.querySelector('#confirmButton');

confirmButton.addEventListener('click', () => {
    createList(taskName.value,null,true);
})

//add new task
async function addNewTask() {
    list.style.display='none';
    await sleep(300);
    addTask.style.display='block';
}
