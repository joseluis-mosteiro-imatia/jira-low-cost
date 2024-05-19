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
    if (inputProjet.value.length == 0) {
        alert("Debes introducir el proyecto vinculado a la tarea");
        return;
    }
    if (inputTitle.value.length == 0) {
        alert("Debes introducir el título de la tarea");
        return;
    }
    if (inputDescription.value.length == 0) {
        alert("Porfavor intruduce una breve descripción de la tarea");
        return;
    }
    //Si ya han cubierto todos los campos se puede crear la tarea
    if (inputProjet.value.length > 0 && inputTitle.value.length > 0 && inputDescription.value.length > 0) {
        let taskDiv = document.createElement("div");//taskDiv es el contenedor que vamos a crear para hacer la tarjeta
        taskDiv.className = "task";

        //Creamos un div en la cabecera de la card para poder meter la fecha y el icono de borrar
        let divHeadCard = document.createElement("div");
        divHeadCard.className = "head-card";
       //En este hijo llamamos a la funcion que crea una fecha justo cuando se hace crea la tarea
        divHeadCard.appendChild(createDate());
                
        //Creamos el icono de borrar para poder mostrarlo en las cards de la ultima columna solo
        let erase = createTrashIcon();  
        divHeadCard.appendChild(erase);
        taskDiv.appendChild(divHeadCard);
        erase.addEventListener('click',deleteTask); 

        taskDiv.appendChild(createProjectName(inputProjet.value));//En este hijo llamamos a la funcion que cera el nombre del proyecto
        taskDiv.appendChild(createTitleTask(inputTitle.value));//En esta la que crea el titulo de la tarea
        
        //Para la descripcion creamos un div que contendrá el elemento parrafo
        let descriptionTask = document.createElement("div");
        descriptionTask.className = "task-description";
        descriptionTask.appendChild(createDescriptionTask(inputDescription.value));//Y la que crea la descripcion
        taskDiv.appendChild(descriptionTask);
       
        //Creamos los iconos de las flechas y los metemos en variables
        let markLeft = createChevronLeft();
        let markRight = createChevronRight();
        //Creo otro div para meter las flechitas
        let divArrows = document.createElement("div");
        divArrows.className = "arrows";

        //Le colgamos al pater dos hijos mas con los iconos de derecha e izquierda
        divArrows.appendChild(markLeft);
        divArrows.appendChild(markRight);
        taskDiv.appendChild(divArrows);

        //Le asignamos unos listeners a los iconos para que cuando hagamos clic se cambie de carril
        markRight.classList.toggle("hidden");
        markRight.addEventListener('click', function () {
            if (toDoContainer.contains(taskDiv)) {
                inProgressContainer.appendChild(taskDiv);
                markLeft.classList.toggle("hidden");
            } else if (inProgressContainer.contains(taskDiv)) {
                doneContainer.appendChild(taskDiv);
                markRight.classList.toggle("hidden");
            }
        });
        markLeft.addEventListener('click', function () {

            if (doneContainer.contains(taskDiv)) {
                inProgressContainer.appendChild(taskDiv);
                markRight.classList.toggle("hidden");
            } else if (inProgressContainer.contains(taskDiv)) {
                toDoContainer.appendChild(taskDiv);
                markLeft.classList.toggle("hidden");
            }
        });

        //Creamos un objeto task
        let task = new Task(inputProjet.value, inputTitle.value, inputDescription.value);
        //Vaciamos los inputs para el siguente uso
        inputProjet.value = '';
        inputTitle.value = '';
        inputDescription.value = '';

        /*Guarda el objeto Task en el almacenamiento local para ello:
         -> Usamos el id generado como clave y el objeto task sería el valor que tenemos que 
            convertir en una cadena de texto con JSON.stringify(); */
        localStorage.setItem(task.id, JSON.stringify(task));
        /*El Id unico que le ha asignado el constructor lo obtenemos para añadirselo al html
          y asi poder unir los elementos de js y html*/
        taskDiv.id = task.id;
        //Agrega el div de la tarea al contenedor de tareas pendientes     
        toDoContainer.appendChild(taskDiv)
    }

}

function createDate() {
    let dateCreationTask = document.createElement("span");
    dateCreationTask.className = "date";
    dateCreationTask.innerText = new Date().toLocaleDateString();
    return dateCreationTask;
}

function deleteTask() {
    //como he metido el span del icono de basura en un div con la fecha para poder maquetarlo ahora tengo que llamar al abuelo en vez de al padre
    let taskDiv=this.parentNode.parentNode;   
    taskDiv.remove();
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
    let paragraph = document.createElement("p");
    paragraph.className = "paragraph-decription";
    paragraph.textContent = descriptionTask;
    return paragraph;
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


function Task(projectName, titleTask, descriptionTask) {
    this.projectName = projectName;
    this.titleTask = titleTask;
    this.descriptionTask = descriptionTask;
    this.createDate = createDate();
    this.id = crypto.randomUUID();
    this.taskTodo= true //le indicamos que por defecto iniciaria en el estado taskTodo
    this.taskinProgress =  false;
    this.taskDone = false;
}

function recoverTaskFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let taskObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let taskHTML = createRecoveredTaskFromLocalStorage(taskObj);
        if(taskObj.taskTodo){
            toDoContainer.appendChild(taskHTML);
        }else if (taskObj.taskinProgress){
            inProgressContainer.appendChild(taskHTML);
        }else if(taskObj.taskDone){
            doneContainer.appendChild(taskHTML);
        } 
    }
}

function createRecoveredTaskFromLocalStorage(taskObj) {
    let div = document.createElement('div');
    div.className = "task";
    div.id = taskObj.id; 

    let erase = createTrashIcon();
    div.appendChild(erase);    
    erase.addEventListener('click', deleteTask);

    let divArrows = document.createElement("div");
    divArrows.className = "arrows";
    let markLeft = createChevronLeft();
    let markRight = createChevronRight();
    divArrows.appendChild(markLeft);
    divArrows.appendChild(markRight);
    div.appendChild(divArrows);

    markRight.classList.toggle("hidden");
    markRight.addEventListener('click', function () {
        if (toDoContainer.contains(div)) {
            inProgressContainer.appendChild(div);
            markLeft.classList.toggle("hidden");
            taskObj.taskTodo=false;
            taskObj.taskinProgress=true;
        } else if (inProgressContainer.contains(div)) {
            doneContainer.appendChild(div);
            markRight.classList.toggle("hidden");           
            taskObj.taskinProgress=false;
            taskObj.taskDone=true;
        }
    });
    markLeft.addEventListener('click', function () {
        if (doneContainer.contains(div)) {
            inProgressContainer.appendChild(div);
            markRight.classList.toggle("hidden");
            taskObj.taskDone=false;
            taskObj.taskinProgress= true;
        } else if (inProgressContainer.contains(div)) {
            toDoContainer.appendChild(div);
            markLeft.classList.toggle("hidden");
            taskObj.taskinProgress=false;
            taskObj.taskTodo=true;
        }
    });      

    return div;
}





