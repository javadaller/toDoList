//init
let addTaskOpen=false;
const listContainer=document.querySelector('#list');
const addTask=document.querySelector('#addTask');

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
        listContainer.style.display='block';
    }
})

async function addNewTask() {
    addTaskOpen=true;
    listContainer.style.display='none';
    await sleep(300);
    addTask.style.display='block';
}