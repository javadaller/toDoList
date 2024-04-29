//CREATE LIST
export async function createList(list) {
  const name=escapeHTML(list.name);

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

// CREATE DIV
export function createDiv(type,parent,content,className) {
  const newDiv=document.createElement(type);
  if (type!='') {
    newDiv.innerHTML=content;
  }
  if (className!=null) {
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
export function escapeHTML(text) {
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

// IS MOBILE
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

//------------------------------------------------------------------------------------------

// RANDOM COLOR
function randomColor() {
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return '#'+randomColor;
}