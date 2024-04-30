//CREATE LIST
export async function createList(inputName,checked,newTask) {
  const listContainer = document.querySelector('#listContainer');
  const error = document.querySelector('#inputError');

  const name = escapeHTML(inputName);

  const newIndex = listContainer.children.length;
  const taskID = generateID(name, newIndex);

  if (name == '') {

      taskName.classList.add('error');
      error.innerText = 'the name is empty';

  } else if(name.length<20) {

      addTask.style.display = 'none';

      //container
      const taskContainer = createDiv('li',listContainer,null,'task');
      taskContainer.id = taskID;

      //drag svg
      const taskDrag = createDiv('img',taskContainer,null,'svgDrag');
      taskDrag.src = "assets/images/icons/draggable.svg";

      let draggingElement = null;

      taskDrag.addEventListener('mousedown', (event) => {
          event.preventDefault();

          draggingElement = taskContainer;

          //initial position
          const initialOffset = event.clientY - draggingElement.getBoundingClientRect().top;
          document.addEventListener('mousemove', onMouseMove);

          function onMouseMove(event) {
              if (draggingElement) {
                  const newY = event.clientY - initialOffset*10;
                  draggingElement.style.transform = `translateY(${newY}px)`;
              }
          }

          //stop drag
          document.addEventListener('mouseup', onMouseUp);

          function onMouseUp(event) {
              if (draggingElement) {
                  draggingElement.style.transform = 'none';
                  draggingElement = null;

                  const newIndex = calculateNewIndex(event.clientY);

                  //insert into new position
                  if (newIndex !== -1) {
                      const referenceNode = listContainer.children[newIndex];
                      listContainer.insertBefore(taskContainer, referenceNode);
                  }

                  //remove up and move
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
      const taskContainerName = createDiv('p',taskContainer,name,'taskName');

      //task check
      const taskCheck = createDiv('input',taskContainer,'taskCheck');
      taskCheck.type = 'checkbox';
      if(checked != null) {
        taskCheck.checked = checked;
        if(checked) {
          taskContainerName.style.textDecoration = 'line-through';
          taskContainerName.style.color = 'grey';
        } else {
          taskContainerName.style.textDecoration = 'none';
          taskContainerName.style.color = 'inherit';
        }
      }
      checkTask(taskCheck,taskContainerName,taskID);

      //task delete
      const taskDelete = createDiv('img',taskContainer,null,'svgDelete');
      taskDelete.src = "assets/images/icons/remove.svg";
      deleteTask(taskID,taskDelete);

      //update storage
      if(newTask) {
        const newTask = {id:taskID, name: name, checked: taskCheck.checked };
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      
      //reset
      taskName.value = '';
      taskName.classList.remove('error');
      taskName.classList.add('noError');
      error.innerText = '';
      await sleep(300);
      list.style.display = 'block';

  } else {
      taskName.classList.add('error');
      error.innerText = '20 characters maximum';
  }
} //end createList

///////////////////////////////////////////////////////////////////////////////////////

// CREATE DIV
function createDiv(type,parent,content,className) {
  const newDiv = document.createElement(type);
  if (type != '') {
    newDiv.innerHTML = content;
  }
  if (className != null) {
    newDiv.classList.add(className);
  }
  parent.appendChild(newDiv);
  return newDiv;
}

//------------------------------------------------------------------------------------------
// SLEEP FUNCTION
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//------------------------------------------------------------------------------------------

// ESCAPE HTML
function escapeHTML(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//------------------------------------------------------------------------------------------

//DELETE TASK
function deleteTask(ID,button) {
  button.addEventListener('click', () => {
    if (confirm("Are you sure to remove this task?")) {
      document.querySelector('#'+ID).remove();
    }
  })
}

//------------------------------------------------------------------------------------------

//CHECK TASK
function checkTask(checkbox,task,ID) {
  checkbox.addEventListener('change', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskToUpdate = tasks.find(task => task.id === ID);
    taskToUpdate.checked = checkbox.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if(checkbox.checked) {
        task.style.textDecoration = 'line-through';
        task.style.color = 'grey';
    } else {
        task.style.textDecoration = 'none';
        task.style.color = 'inherit';
    }
  })
}

//------------------------------------------------------------------------------------------

//GENERATE ID
function generateID(name, index) {
  return name.replace(/\s/g, '')+'_'+index;
}

//------------------------------------------------------------------------------------------
