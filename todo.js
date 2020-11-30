const ALL = "ALL";
const ACTIVE= "ACTIVE";
const COMPLETED = "COMPLETED";

let state = {
  data: [],
  items: 0,
  filter : ALL
}
function initApp () {
  if (!localStorage.hasOwnProperty('todo')){
    saveState ();  
  } else {getState()}
  updateList();
}

function saveState () {
  localStorage.setItem('todo', JSON.stringify(state));
}

function getState () {
  state = JSON.parse(localStorage.getItem('todo'));
}
  
function addTask (taskText){
  let newTask = {id : state.items + 1, text : taskText, isDone : false};
  state.data = [...state.data, newTask];
  state.items+=1; 
  saveState();
}

function deleteTask (id){
  let newData = state.data.filter(listItem=>listItem.id != id)
  state.data=newData;
  saveState();
}

function changeTaskCompletion(id){
  for (let listItem of state.data){
    if(listItem.id == id){
      listItem.isDone = !listItem.isDone
    }
  }
  saveState();  
}
function toggleAllTasksCompletion(value){
  for (let listItem of state.data){
      listItem.isDone = value;
    }
  saveState();  
}


function changeTaskText(id, text){
  for (let listItem of state.data){
    if(listItem.id == id){
      listItem.text = text;
    }
  }
  saveState(); 
}

function deleteCompletedTasks () {
  let newData = state.data.filter(listItem=>!listItem.isDone)
  state.data=newData;
  saveState(); 
}

function setFilter (filter) {
  state.filter = filter;
  saveState();
}

function getTasks (filter){
  let tasks = state.data;
  switch (filter){
    case ALL : { return tasks;}
    case ACTIVE :  { return tasks.filter(listItem=>!listItem.isDone);}
    case COMPLETED : { return tasks.filter(listItem=>listItem.isDone);}
  }
}

function numberOfActiveTasks () {
  let count = 0;
  for (let item of state.data){
    if (!item.isDone) {
      count++;
    }
  }
  return count;
}

function numberOfCompletedTasks () {
  let count = 0;
  for (let item of state.data){
    if (item.isDone) {
      count++;
    }
  }
  return count;
}

function numberOfTasks () {
  return state.data.length;
}

let todoInput = document.querySelector('.todo-input');
todoInput.onchange=()=>{addTask(todoInput.value); 
                        todoInput.value=''; 
                        updateList();}

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
                       
function createTaskList(list){
  let todoList= document.querySelector('.todo-list');
  todoList.innerHTML='';
  for (let task of list){
    let listItem = document.createElement('li');
    listItem.classList.add('todo-list-item');
    listItem.dataset.id=task.id;
    listItem.onmouseover=()=>{listItem.lastChild.style.visibility='visible'}
    listItem.onmouseout=()=>{listItem.lastChild.style.visibility='hidden'}

    let doneBox = document.createElement('input');
    doneBox.type='checkbox'
    doneBox.classList.add('done-box')
    doneBox.id=task.id;
    doneBox.onchange=()=>{changeTaskCompletion(task.id);
                          taskText.classList.toggle('task-done')
                          updateList()};
    listItem.append(doneBox);

    let doneLabel = document.createElement('label');
    doneLabel.classList.add('done-label');
    doneLabel.htmlFor=task.id;
    listItem.append(doneLabel);

    let taskText = document.createElement('p');
    taskText.classList.add('task-text')
    taskText.textContent = task.text;
    taskText.ondblclick= ()=>{taskText.classList.add('not-displayed');
                              doneLabel.classList.add('not-displayed');
                              deleteButton.classList.add('not-displayed');
                              let newInput = document.createElement('input');
                              newInput.type='text';
                              newInput.classList.add('new-text-input');
                              newInput.value = task.text;
                              newInput.onchange=()=>{changeTaskText(listItem.dataset.id, newInput.value)
                                                      taskText.textContent=newInput.value;
                                                      listItem.removeChild(newInput); 
                                                      delete newInput;  
                                                      taskText.classList.remove('not-displayed');
                                                      doneLabel.classList.remove('not-displayed');
                                                      deleteButton.classList.remove('not-displayed');}
                              listItem.append(newInput);
    };
    listItem.append(taskText);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '\u00D7';
    deleteButton.onclick=()=>{deleteTask(deleteButton.parentNode.dataset.id);
                                updateList()}
    listItem.append(deleteButton);
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


