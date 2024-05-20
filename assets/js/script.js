// VARIABLES:
var inputContainer = document.getElementById("inp-tasks-container");
var inputProjectName = document.getElementById("inp-project-name");
var inputTaskName = document.getElementById("inp-task-name");
var inputTaskDescription = document.getElementById("inp-task-description");
var inputButton = document.getElementById("btn-create-task");
var notDoneTask = document.getElementById("not-done-task-container");
var inProgressTask = document.getElementById("in-progress-task-container");
var doneTask = document.getElementById("done-task-container");

//EVENTOS:
inputButton.addEventListener("click", addTask);
inputContainer.addEventListener("keypress", function (event) { /*¿¿¿Por qué funciona???*/
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

// FUNCIONES:
// Función principal --> añadir tarea al contenedor de las tareas no hechas:
function addTask() {
    if (inputProjectName.value.trim().length > 0 && 
        inputTaskName.value.trim().length > 0 &&
        inputTaskDescription.value.trim().length > 0) {
            if (document.getElementById("error-div").innerText === "  ¡Faltan campos por rellenar!  ") {
                document.getElementById("error-div").innerText = "";
            }

            //Esta variable se reutilizará en el resto de funciones, dentro de la función addTask():
            let taskDiv = document.createElement("div");

            //Creamos el contenedor global de la tarea:
            createTask(taskDiv);

            //Creamos el contenedor con el nombre del proyecto:
            createProjectName(taskDiv,inputProjectName.value);

            //Creamos el contenedor con el nombre de la tarea:
            createTaskName(taskDiv, inputTaskName.value);
            
            //Creamos el contenedor con la descripción de la tarea:
            createTaskDescription(taskDiv, inputTaskDescription.value);

            //Creamos el contenedor con la fecha en la que se creó la tarea:
            createTaskDate(taskDiv);

            //Creamos el botón de la flecha a la izquierda:
            createLeftArrow(taskDiv);
            
            //Creamos el botón de "basura":
            createTrash(taskDiv);

            //Creamos el botón de la flecha a la derecha:
            createRightArrow(taskDiv);
            
            //Hacemos que las tareas se puedan arrastrar entre columnas (draggable items):
            makeDraggable(taskDiv);

            //Se crea un nuevo objeto de la clase Task:
            let task = new Task(inputProjectName.value, 
                                inputTaskName.value, 
                                inputTaskDescription.value, 
                                new Date().toLocaleDateString("es", { year:"numeric", month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" }),
                                false);

            //Reestablecemos los inputs a su valor predeterminado (vacío):
            resetInputs();

            //Guardamos la tarea en el localstorage:
            localStorage.setItem(task.id, JSON.stringify(task));
            taskDiv.id = task.id;

            //Se introduce el contenedor de la tarea en la columna de tareas sin realizar:
            notDoneTask.appendChild(taskDiv);
    } else {
        let errorDiv = document.getElementById("error-div");
        errorDiv.innerText = "  ¡Faltan campos por rellenar!  ";
    }
}

//Función --> crear tarea:
function createTask(taskDiv) {
    taskDiv.className = "task";
    taskDiv.setAttribute("draggable", "true");
}

//Función --> crear nombre del proyecto dentro de la tarea:
function createProjectName(taskDiv, projectName) {
    let projectNameDiv = document.createElement("div");
    projectNameDiv.className = "project-name-task";
    projectNameDiv.innerText = projectName;
    taskDiv.appendChild(projectNameDiv);
}

//Función --> crear nombre de la tarea dentro de la tarea:
function createTaskName(taskDiv, taskName) {
    let taskNameDiv = document.createElement("div");
    taskNameDiv.className = "task-name-task";
    taskNameDiv.innerText = taskName;
    taskDiv.appendChild(taskNameDiv);
}

//Función --> crear descripción de la tarea dentro de la tarea:
function createTaskDescription(taskDiv, taskDescription) {
    let taskDescDiv = document.createElement("div");
    taskDescDiv.className = "task-desc-task";
    taskDescDiv.innerText = taskDescription;
    taskDiv.appendChild(taskDescDiv);
}

//Función --> generar la fecha y la hora exactas en las que se creó la tarea:
function createTaskDate(taskDiv, date) {
    let creationDate = document.createElement("div");
    creationDate.className = "task-date-task";
    creationDate.innerText = date || new Date().toLocaleDateString("es", { year:"numeric", month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });
    taskDiv.appendChild(creationDate);
}

//Función --> crear el icono de "flecha izquierda" que, al pulsarlo, moverá la tarea a la columna que tenga a su izquierda:
function createLeftArrow(taskDiv) {
    let leftArrow = document.createElement("img");
    leftArrow.className = "left-arrow";
    leftArrow.setAttribute("src", "assets/images/arrow_left.svg")
    taskDiv.appendChild(leftArrow);
    leftArrow.addEventListener("click", () => {
        if(taskDiv.parentNode === doneTask) {
            inProgressTask.appendChild(taskDiv);
            setPositionLocalStorage("nada", taskDiv.id);
        } else if (taskDiv.parentNode === inProgressTask) {
            notDoneTask.appendChild(taskDiv);
            setPositionLocalStorage(false, taskDiv.id);
        }
    });
}

//Función --> crear el icono de "papelera" que, al pulsarlo, eliminará la tarea:
function createTrash(taskDiv) {
    let remove = document.createElement("img");
    remove.className = "trash";
    remove.setAttribute("src", "assets/images/trash.svg")
    taskDiv.appendChild(remove);
    remove.addEventListener("click", () => {
    taskDiv.remove();
    localStorage.removeItem(taskDiv.id);
    });
}

//Función --> crear el icono de "flecha izquierda" que, al pulsarlo, moverá la tarea a la columna que tenga a su izquierda:
function createRightArrow(taskDiv) {
    let rightArrow = document.createElement("img");
    rightArrow.className = "right-arrow";
    rightArrow.setAttribute("src", "assets/images/arrow_right.svg")
    taskDiv.appendChild(rightArrow);
    rightArrow.addEventListener("click", () => {
        if(taskDiv.parentNode === notDoneTask) {
            inProgressTask.appendChild(taskDiv);
            setPositionLocalStorage("nada", taskDiv.id);
        } else if (taskDiv.parentNode === inProgressTask) {
            doneTask.appendChild(taskDiv);
            setPositionLocalStorage(true, taskDiv.id);
        }
    });
}

//Función --> permite al usuario arrastrar las tareas entre las tres columnas manteniendo pulsado el clic izquierdo del ratón:
function makeDraggable(taskDiv) {
    taskDiv.addEventListener("dragstart", (e) => {
        let selected = e.currentTarget;
        
        notDoneTask.addEventListener("dragover", (e) => e.preventDefault());
        notDoneTask.addEventListener("drop", () => {
            if (selected != null) {
                notDoneTask.appendChild(selected);
                setPositionLocalStorage(false, taskDiv.id);
                selected = null;
            }
        });
        
        inProgressTask.addEventListener("dragover", (e) => e.preventDefault());
        inProgressTask.addEventListener("drop", () => {
            if (selected != null) {
                inProgressTask.appendChild(selected);
                setPositionLocalStorage("nada", taskDiv.id);
                selected = null;
            }
        });

        doneTask.addEventListener("dragover", (e) => e.preventDefault());
        doneTask.addEventListener("drop", () => {
            if (selected != null) {
                doneTask.appendChild(selected);
                setPositionLocalStorage(true, taskDiv.id);
                selected = null;
            }
        });
    });
}

//Función --> reestablece los valores predeterminados de los inputs (es decir, vacíos):
function resetInputs() {
    inputProjectName.value = "";
    inputTaskName.value = "";
    inputTaskDescription.value = "";
}

//CLASE TASK 
class Task {
    constructor (projectName, taskName, taskDescription, taskCreationDate, taskDone) {
        this.projectName = projectName;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskCreationDate = taskCreationDate;
        this.taskDone = taskDone;
        this.id = crypto.randomUUID();
    }
}

//FUNCIONES DE LOCALSTORAGE
// Función --> cambia el estado de la tarea (sin hacer: false, en progreso: "nada", hecho: true):
function setPositionLocalStorage(taskValue, taskId) {
    let taskString = localStorage.getItem(taskId);
    let taskObj = JSON.parse(taskString);
    taskObj.taskDone = taskValue;
    localStorage.setItem(taskId, JSON.stringify(taskObj));
}

//Función --> recupera los datos almacenados en localstorage:
function recoverTaskFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.getItem(localStorage.key(i)))
        let taskObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        console.log(createRecoveredTaskFromLocalStorage(taskObj));
        let taskHTML = createRecoveredTaskFromLocalStorage(taskObj);
        if (taskObj.taskDone === false) {
            notDoneTask.appendChild(taskHTML);
        } else if (taskObj.taskDone === "nada") {
            inProgressTask.appendChild(taskHTML);
        } else if (taskObj.taskDone === true) {
            doneTask.appendChild(taskHTML);
        }
    }
}

//Función --> guarda la información en localstorage: (AVISO. Esto está en obras, así que ponte el casco y el chaleco reflectante)
function createRecoveredTaskFromLocalStorage(taskObj) {
    let taskDiv = document.createElement('div');
    createTask(taskDiv);
    taskDiv.id = taskObj.id;
    createProjectName(taskDiv, taskObj.projectName);
    createTaskName(taskDiv, taskObj.taskName);
    createTaskDescription(taskDiv, taskObj.taskDescription);
    createTaskDate(taskDiv, taskObj.taskCreationDate);
    createLeftArrow(taskDiv);
    createTrash(taskDiv);
    createRightArrow(taskDiv);
    makeDraggable(taskDiv);
    return taskDiv;
}