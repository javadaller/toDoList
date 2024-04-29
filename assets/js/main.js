import {sleep,createDiv,escapeHTML,createList} from './fnc.js';

//init
let addTaskOpen=false;
const list=document.querySelector('#list');
const addTask=document.querySelector('#addTask');
const listContainer=document.querySelector('#listContainer');
const taskName=document.querySelector('#taskName');
const error=document.querySelector('#inputError');

//local storage
// let storage=localStorage.getItem('tasks');
// if(storage!=null) {
//     console.log('chargement taches');
//     storage=localStorage.getItem('tasks');
//     storage.forEach(element => {
//         createList(element);
//     });
    
// } else {
//     storage=[];
//     localStorage.setItem('tasks', storage);
// }

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

    if (name=='') {

        taskName.classList.add('error');
        error.innerText='the name is empty';

    } else if(name.length<20) {

        addTaskOpen=false;
        addTask.style.display='none';

        //container
        const taskContainer=createDiv('li',listContainer,null,'task');

        //drag svg
        const taskDrag=createDiv('img',taskContainer,null,'svgDrag');
        taskDrag.src="assets/images/icons/draggable.svg";

        let draggingElement = null;

        taskDrag.addEventListener('mousedown', (event) => {
            event.preventDefault(); // Empêcher la sélection de texte

            draggingElement = taskContainer;

            // Sauvegarder la position initiale de l'élément
            const initialOffset = event.clientY - draggingElement.getBoundingClientRect().top;

            // Événement mousemove : déplacer l'élément
            document.addEventListener('mousemove', onMouseMove);

            function onMouseMove(event) {
                if (draggingElement) {
                    // Calculer la nouvelle position de l'élément
                    const newY = event.clientY - initialOffset*10;

                    // Appliquer la translation à l'élément
                    draggingElement.style.transform = `translateY(${newY}px)`;
                }
            }

            // Événement mouseup : arrêter le déplacement
            document.addEventListener('mouseup', onMouseUp);

            function onMouseUp(event) {
                if (draggingElement) {
                    // Réinitialiser l'élément en cours de déplacement
                    draggingElement.style.transform = 'none';
                    draggingElement = null;

                    // Trouver la nouvelle position de l'élément dans la liste
                    const newIndex = calculateNewIndex(event.clientY);

                    // Réinsérer l'élément à sa nouvelle position
                    if (newIndex !== -1) {
                        const referenceNode = listContainer.children[newIndex];
                        listContainer.insertBefore(taskContainer, referenceNode);
                    }

                    // Supprimer les gestionnaires d'événements mousemove et mouseup
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
            }
        });

        function calculateNewIndex(clientY) {
            const listItems = [...listContainer.children];

            for (let i = 0; i < listItems.length; i++) {
                const rect = listItems[i].getBoundingClientRect();
                if (clientY < rect.top + rect.height / 2) {
                    return i;
                }
            }

            return listItems.length;
        }

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

        //update storage
        const newTask = { name: name, checked: false };
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        //reset
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

