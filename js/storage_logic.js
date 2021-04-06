const ALL = "ALL";
const ACTIVE= "ACTIVE";
const COMPLETED = "COMPLETED";

let state = {
  data: [],
  items: 0,
  filter : ALL
}

function saveState () {
  localStorage.setItem('todo', JSON.stringify(state));
}

function getState () {
  state = JSON.parse(localStorage.getItem('todo'));
}


function initApp () {
  if (!localStorage.hasOwnProperty('todo')){
    saveState ();  
  } else {getState()}
  updateList();
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
