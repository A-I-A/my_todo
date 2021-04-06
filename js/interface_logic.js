let todoInput = document.querySelector('.todo-input');
todoInput.onblur=(event)=>{event.preventDefault();todoInput.focus()}
todoInput.onblur=()=>{todoInput.value='';}
todoInput.onkeydown=(event)=>{if (event.key == 'Enter' || event.key == 'Escape'){
                               addTask(todoInput.value); 
                               todoInput.value=''; 
                               updateList();}}

function updateAllDoneToggle (){
  let all = numberOfTasks();
  let completed = numberOfCompletedTasks();
  let allDoneToggle = document.querySelector('.all-done-toggle');
  all > 0 ? allDoneToggle.disabled= false : allDoneToggle.disabled=true;
  if ( all > completed) {
    allDoneToggle.classList.remove('all-done-toggle-all-done');
  } else{
    allDoneToggle.classList.add('all-done-toggle-all-done');
  }
  allDoneToggle.onclick = ()=>{if(all > completed){
                                toggleAllTasksCompletion(true);
                               } else{
                                toggleAllTasksCompletion(false);
                               }
                               updateList()};                            
} 

let listItemTemplate = document.querySelector('#list-item-template').content;
                      
function createTaskList(list){
  let todoList= document.querySelector('.todo-list');
  todoList.innerHTML='';
  for (let task of list){
    let listItem = listItemTemplate.querySelector('.todo-list-item').cloneNode(true); 
    let doneBox = listItem.querySelector('.done-box');
    let doneLabel = listItem.querySelector('.done-label');
    let taskText = listItem.querySelector('.task-text');
    let deleteButton = listItem.querySelector('.delete-button');

    listItem.onmouseover=()=>{deleteButton.style.visibility='visible'}
    listItem.onmouseout=()=>{deleteButton.style.visibility='hidden'}
    doneBox.id=task.id;
    doneBox.onchange=()=>{changeTaskCompletion(task.id);
                          taskText.classList.toggle('task-done')
                          updateList()};
    doneLabel.htmlFor=task.id;
    taskText.textContent = task.text;
    taskText.ondblclick= ()=>{taskText.classList.add('not-displayed');
                              doneLabel.classList.add('not-displayed');
                              deleteButton.classList.add('not-displayed');
                              let newInput = document.createElement('input');
                              newInput.type='text';
                              newInput.classList.add('new-text-input');
                              newInput.value = task.text;
                              listItem.append(newInput);
                              newInput.focus();
                              newInput.onblur=()=>{changeTaskText(task.id, newInput.value)
                                                      taskText.textContent=newInput.value;
                                                      newInput.remove();  
                                                      taskText.classList.remove('not-displayed');
                                                      doneLabel.classList.remove('not-displayed');
                                                      deleteButton.classList.remove('not-displayed');}
                              newInput.onkeydown=(event)=>{if (event.key == 'Enter' || event.key == 'Escape'){ 
                                                            changeTaskText(task.id, newInput.value)
                                                            taskText.textContent=newInput.value;
                                                            newInput.remove();  
                                                            taskText.classList.remove('not-displayed');
                                                            doneLabel.classList.remove('not-displayed');
                                                            deleteButton.classList.remove('not-displayed');}}
                              
    };
    deleteButton.textContent = '\u00D7';
    deleteButton.onclick=()=>{deleteTask(task.id);                       
                              updateList()}
    if (task.isDone){
      doneBox.checked=true;
      taskText.classList.add('task-done');
      }
    todoList.append(listItem);
  }                              
}

function prepareFilters (){
  let filters = document.querySelectorAll('.filter');
  for (let filter of filters) {filter.classList.remove('bordered')};
  switch (state.filter){
      case ALL : filters[0].classList.add('bordered'); break;
      case COMPLETED : filters[1].classList.add('bordered'); break;
      case ACTIVE : filters[2].classList.add('bordered'); break;
  }
  filters[0].onclick = ()=>{setFilter(ALL); updateList()};
  filters[1].onclick= ()=>{setFilter(COMPLETED); updateList()};
  filters[2].onclick = ()=>{setFilter(ACTIVE); updateList()};
}

 function updateFooter(){
  let all = numberOfTasks();
  let completed = numberOfCompletedTasks();
  let active = numberOfActiveTasks();

  let footer = document.querySelector('.footer');
  all > 0 ? footer.style.visibility= 'visible' : footer.style.visibility= 'hidden';

  let itemsLeft = document.querySelector('.items-left');
  itemsLeft.textContent =  active + ' items left';
  let deleteCompleted = document.querySelector('.delete-completed');
  if (completed){
    deleteCompleted.style.visibility='visible';
    deleteCompleted.value= 'clear completed [' + completed + "]";
  } else {
    deleteCompleted.style.visibility = 'hidden';
  }
  deleteCompleted.onclick=()=>{deleteCompletedTasks();
                               deleteCompleted.style.visibility='hidden';
                               updateList()};
  prepareFilters();
 }


function updateList (){
  updateAllDoneToggle();
  createTaskList(getTasks(state.filter));
  updateFooter();
}

initApp();


