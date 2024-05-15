var btnAddtask = document.getElementById("add-task-btn");
var inputProjet = document.getElementById("add-project-input");
var inputTitle = document.getElementById("add-title-input");
var inputDescription = document.getElementById("add-description-input");
var toDoContainer = document.getElementById("to-do-container");
var inProgressContainer = document.getElementById("in-progress-container");
var doneContainer = document.getElementById("done-container");


btnAddtask.addEventListener('click', addTask);//En los eventListener las funciones se invocan sin parentesis



function addTask() {
    let taskDiv= document.createElement("div");//taskDiv es el contenedor que vamos a crear para hacer la tarjeta
    taskDiv.className= "task";
    //Aqui creamos los hijos que cuelgan del taskDiv
    taskDiv.appendChild(createProjectName(inputProjet.value));//En este hijo llamamos a la funcion que cera el nombre del proyecto
    taskDiv.appendChild(createTitleTask(inputTitle.value));//En esta la que crea el titulo de la tarea
    taskDiv.appendChild(createDescriptionTask(inputDescription.value));//Y la que crea la descripcion

    //creamos un objeto task
    let task = new Task(inputProjet.value, inputTitle.value, inputDescription.value, false);
    //Vaciamos los inputs para el siguente uso
    inputProjet.value = '';
    inputTitle.value = '';
    inputDescription.value = '';
    //Le colgamos al pater dos hijos mas llamando a las funciones de crear chevron, izquierda y derecha
    taskDiv.appendChild(createChevronLeft());
    taskDiv.appendChild(createChevronRight());
    // Guarda el objeto Task en el almacenamiento local
    localStorage.setItem(task.id, JSON.stringify(task));
    // Asigna un ID único al div de la tarea
    taskDiv.id = task.id;   
     // Agrega el div de la tarea al contenedor de tareas pendientes     
    toDoContainer.appendChild(taskDiv)    
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
    span.className = "material-symbols-outlined chevron_left"
    span.innerText = "chevron_left";//esto es el icono que va a sustituir al texto entre los spans con el mismo nombre
    return span
}

function createChevronRight() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined chevron_right"
    span.innerText = "chevron_right";
    return span
}



function Task(projectName, titleTask, descriptionTask, taskDone) {
    this.projectName = projectName;
    this.titleTask = titleTask;
    this.descriptionTask = descriptionTask;
    this.taskDone = taskDone;
    this.taskCreate = new Date();
    this.id = crypto.randomUUID();
}