var btnAddtask = document.getElementById("add-task-btn");
var inputProjet = document.getElementById("add-project-input");
var inputTitle = document.getElementById("add-title-input");
var inputDescription = document.getElementById("add-description-input");
var toDoContainer = document.getElementById("to-do-container");
var inProgressContainer = document.getElementById("in-progress-container");
var doneContainer = document.getElementById("done-container");


btnAddtask.addEventListener('click', addTask);//En los eventListener las funciones se invocan sin parentesis



function addTask() {
    //Avisos para el usuario con respecto a los campos sin cubrir
    if(inputProjet.value.length == 0 ) {
        alert("Debes introducir el proyecto vinculado a la tarea");
        return;        
    }
    if(inputTitle.value.length == 0 ) {
        alert("Debes introducir el título de la tarea");
        return;
    }
    if(inputDescription.value.length == 0 ) {
        alert("Porfavor intruduce una breve descripción de la tarea");
        return;
    }
    //Si ya han cubierto todos los campos se puede crear la tarea
    if (inputProjet.value.length > 0 && inputTitle.value.length > 0 && inputDescription.value.length > 0){
    let taskDiv= document.createElement("div");//taskDiv es el contenedor que vamos a crear para hacer la tarjeta
    taskDiv.className= "task";

    //Creamos el icono de borrar para poder mostrarlo en las cards de la ultima columna solo
    let erase = createTrashIcon();
    taskDiv.appendChild(erase);
    erase.addEventListener('click', deleteTask);

    //Aqui creamos los hijos que cuelgan del taskDiv  
    taskDiv.appendChild(createDate());//En este hijo llamamos a la funcion que crea una fecha justo cuando se hace crea la tarea
    taskDiv.appendChild(createProjectName(inputProjet.value));//En este hijo llamamos a la funcion que cera el nombre del proyecto
    taskDiv.appendChild(createTitleTask(inputTitle.value));//En esta la que crea el titulo de la tarea
    taskDiv.appendChild(createDescriptionTask(inputDescription.value));//Y la que crea la descripcion
   
    //Creamos los iconos y los metemos en variables
    let markLeft= createChevronLeft();
    let markRight= createChevronRight();
    //Creo otro div para meter las flechitas
    let divArrows= document.createElement("div");
    divArrows.className= "arrows";

    //Le colgamos al pater dos hijos mas con los iconos de derecha e izquierda
    divArrows.appendChild(markLeft);
    divArrows.appendChild(markRight);
    taskDiv.appendChild(divArrows);
    //Le asignamos un listener al icono para que cuando hagamos clic se cambie de carril
   
    markRight.classList.toggle("hidden");
    markRight.addEventListener('click',function(){
        if(toDoContainer.contains(taskDiv)){
            inProgressContainer.appendChild(taskDiv);
            markLeft.classList.toggle("hidden");           
        }else if (inProgressContainer.contains(taskDiv)){
            doneContainer.appendChild(taskDiv);   
            markRight.classList.toggle("hidden");                 
        }
    });  
    markLeft.addEventListener('click',function(){

        if(doneContainer.contains(taskDiv)){
            inProgressContainer.appendChild(taskDiv);
            markRight.classList.toggle("hidden");
        }else if (inProgressContainer.contains(taskDiv)){
            toDoContainer.appendChild(taskDiv);
            markLeft.classList.toggle("hidden");  
        }
    });
   
     //creamos un objeto task
     let task = new Task(inputProjet.value, inputTitle.value, inputDescription.value, 1);
     //Vaciamos los inputs para el siguente uso
     inputProjet.value = '';
     inputTitle.value = '';
     inputDescription.value = '';

    // Guarda el objeto Task en el almacenamiento local
    localStorage.setItem(task.id, JSON.stringify(task));
    // Asigna un ID único al div de la tarea
    taskDiv.id = task.id;      
     // Agrega el div de la tarea al contenedor de tareas pendientes     
    toDoContainer.appendChild(taskDiv) 
    }  
  
}


function createDate(){    
    let dateCreationTask= document.createElement("span");
    dateCreationTask.className="date";
    dateCreationTask.innerText= new Date().toLocaleDateString();
    return dateCreationTask;
}

function deleteTask() {
    this.parentNode.remove();
    let taskId = this.parentNode.id;
    localStorage.removeItem(taskId);
}


function createProjectName(projectName) {
    let div = document.createElement("div");
    div.className = "proyect";
    div.innerText = projectName;
    return div;
}
function createTitleTask(titleTask) {
    let div = document.createElement("div");
    div.className = "title";
    div.innerText = titleTask;
    return div;
}
function createDescriptionTask(descriptionTask) {
    let div = document.createElement("div");
    div.className = "task-description";
    div.innerText = descriptionTask;
    return div;
}

function createChevronLeft() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined chevron_left hidden"
    span.innerText = "chevron_left";//esto es el icono que va a sustituir al texto entre los spans con el mismo nombre
    return span
}

function createChevronRight() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined chevron_right hidden"
    span.innerText = "chevron_right";
    return span
}

function createTrashIcon() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined trash ";//recuerda ponerle hidden
    span.innerText = "delete";
    return span;
}


function Task(projectName, titleTask, descriptionTask, taskStatus) {
    this.projectName = projectName;
    this.titleTask = titleTask;
    this.descriptionTask = descriptionTask;
    this.taskStatus = taskStatus;
    this.createDate = new Date();
    this.id = crypto.randomUUID();
}

function recoverTaskFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let taskObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let taskHTML = createRecoveredTaskFromLocalStorage(taskObj);
        if (taskObj.taskDone) {
            doneContainer.appendChild(taskHTML);
        } else {
            toDoContainer.appendChild(taskHTML);
        }
    }
}

function createRecoveredTaskFromLocalStorage(taskObj) {
    let div = document.createElement('div');
    div.className = "task";
    div.id = taskObj.id;
   //falta toda la parte de las flechas
    let erase = createTrashIcon();
    div.appendChild(erase);
    erase.addEventListener('click', deleteTask);
    return div;
}