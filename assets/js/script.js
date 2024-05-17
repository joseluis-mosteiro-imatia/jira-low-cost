var btnProject = document.getElementById("create-project-btn");
var inputName = document.getElementById("name-project-input");
var inputTitle = document.getElementById("title-project-input");
var inputDescription = document.getElementById("description-project-input");
var todoContainer = document.getElementById("todo-project-container");
var inProcessContainer = document.getElementById("inprocess-project-container");
var doneContainer = document.getElementById("done-project-container");
// var limitDateInput = document.getElementById("limit-date-input");
btnProject.addEventListener('click', createProject);
inputTitle.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        createProject();
    }
});

function Project(projectTitle, projectName, projectDescription) {
    this.projectTitle = projectTitle;
    this.projectName = projectName;
    this.projectDescription = projectDescription;
    this.projectDone = 0;
    this.projectCreate = new Date();
    this.id = "project-" + crypto.randomUUID();

    // this.getTitle = function () {
    //     return this.projectTitle;
    // };
    // this.getName = function () {
    //     return this.projectName;
    // };
    // this.getDescription = function () {
    //     return this.projectDescription;
    // };
    // this.isDone = function () {
    //     return this.projectDone;
    // };
    // this.getCreationDate = function () {
    //     return this.projectCreate;
    // }
    // this.markAsDone = function () {
    //     this.projectDone = true;
    // }
    // this.markAsNotDone = function () {
    //     this.projectDone = false;
    // }
    // this.getId = function () {
        //     return this.id;
        // }
    }
function createProject() {
    if (inputTitle.value.length > 0 && inputName.value.length) {
        let projectDiv = document.createElement("div");
        projectDiv.className = "project";
        projectDiv.draggable = true;
        // projectDiv.setAttribute("ondrop", "handleDrop(event)"); 
        // projectDiv.setAttribute("ondragover", "allowDrop(event)");
        projectDiv.setAttribute("ondragstart","drag(event)");

        let name = createProjectDescription(inputName.value);
        let title = createProjectDescription(inputTitle.value);
        let description = createProjectDescription(inputDescription.value);
        name.addEventListener('click', openProject);
        title.addEventListener('click', openProject);
        description.addEventListener('click', openProject);
        let arrowRight = createDirectionArrowRight();
        let arrowLeft = createDirectionArrowLeft();
        projectDiv.appendChild(arrowLeft);
        // arrowLeft.addEventListener('click', projectState);//Falla projectState
        arrowLeft.addEventListener('click', projectStateBackward);
        projectDiv.appendChild(name);
        projectDiv.appendChild(title);
        projectDiv.appendChild(description);
        projectDiv.appendChild(arrowRight);
        // arrowRight.addEventListener('click', projectState);//Falla projectState
        arrowRight.addEventListener('click', projectStateForward);
        // projectDiv.children[4].classList.toggle("hidden");
        projectDiv.children[0].classList.add('hidden');
        
        let erase = createTrashIcon(); 
        projectDiv.appendChild(erase);
        erase.addEventListener('click', deleteProject);
        
        let project = new Project(inputTitle.value, inputName.value, inputDescription.value);
        inputTitle.value = '';
        inputName.value = '';
        inputDescription.value = '';
        // showStateArrow(project.id);

        localStorage.setItem(project.id, JSON.stringify(project));
        projectDiv.id = project.id;
        todoContainer.appendChild(projectDiv);
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    console.log("fUNCTION DRAG id",event.target.id)
}
function allowDrop(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    var projectId = event.dataTransfer.getData("text");
    let projectString = localStorage.getItem(projectId);
    let projectObj = JSON.parse(projectString);
    if((projectObj.id).includes("project-")){
        var projectDiv = document.getElementById(projectId);
        var targetContainer = event.target;
        
        targetId = targetContainer.id;
        
        if  (targetId === "todo-project-container") {
            todoContainer.appendChild(projectDiv);
            projectObj.projectDone = 0;
        }
        
        if  (targetId === "inprocess-project-container") {
            inProcessContainer.appendChild(projectDiv);
            projectObj.projectDone = 1;
        }
        if  (targetId === "done-project-container") {
            doneContainer.appendChild(projectDiv);
            projectObj.projectDone = 2;
        }  
        // let projectId = targetContainer.parentNode.id;
        
        showStateArrow(projectId, targetId);
        localStorage.setItem(projectId, JSON.stringify(projectObj));
}
    
}


function createProjectName(projectName) {
    let span = document.createElement("span");
    span.className = "project-name"
    span.innerText = projectName;
    return span;
}
function createProjectTitle(projectTitle) {
    let span = document.createElement("span");
    span.className = "project-title"
    span.innerText = projectTitle;
    return span;
}
function createProjectDescription(projectDescription) {
    let span = document.createElement("span");
    span.className = "project-description"
    span.innerText = projectDescription;
    return span;
}


function showStateArrow(projectId, containerId){   

    let projectDiv = document.getElementById(projectId);
    let projectString = localStorage.getItem(projectId);
    let projectObj = JSON.parse(projectString);
    if((projectObj.id).includes("project-")){
        if(containerId == "todo-project-container"){
            projectDiv.children[0].classList.add('hidden');
            projectDiv.children[4].classList.remove('hidden');
        }else if(containerId == "inprocess-project-container"){
            projectDiv.children[0].classList.remove('hidden');
            projectDiv.children[4].classList.remove('hidden');
        }else{
            projectDiv.children[0].classList.remove('hidden');
            projectDiv.children[4].classList.add('hidden');
        }
        localStorage.setItem(projectId, JSON.stringify(projectObj));
    }
}
 
// function projectState(){
//     div = this.parentNode;
//     containerId = div.parentNode.id;
//     let projectString = localStorage.getItem(div.id);
//     let projectObj = JSON.parse(projectString);

//     if(projectObj.projectDone == 0){
//         projectObj.projectDone = 1;
//         this.parentNode.children[0].classList.toggle("hidden");
//         inProcessContainer.appendChild(this.parentNode);   
//     }else if(projectObj.projectDone == 2){
//         projectObj.projectDone = 1;
//         this.parentNode.children[4].classList.toggle("hidden");
//        inProcessContainer.appendChild(this.parentNode);
//     }else {
//         // window.alert("No se puede ir más allá");
//         if(div.children[4].classList[1] = "arrowRight"){
//             projectObj.projectDone = 2;
//             this.classList.toggle("hidden");
//             doneContainer.appendChild(this.parentNode); 
//         }else if (div.children[0].classList[1] = "arrowLeft"){
//             projectObj.projectDone = 0;
//             this.classList.toggle("hidden");
//             todoContainer.appendChild(this.parentNode); 
//         }
//     }
//     localStorage.setItem(div.id, JSON.stringify(projectObj));
// }

function projectStateForward() {
    let projectId = this.parentNode.id;
    let projectString = localStorage.getItem(projectId);
    let projectObj = JSON.parse(projectString);
    if((projectObj.id).includes("project-")){
        if(projectObj.projectDone == 0){
            projectObj.projectDone = 1;
            this.parentNode.children[0].classList.toggle("hidden");
            inProcessContainer.appendChild(this.parentNode);   
        }else if(projectObj.projectDone == 1){
            projectObj.projectDone = 2;
            this.parentNode.children[4].classList.toggle("hidden");
            doneContainer.appendChild(this.parentNode);
        }else {
            window.alert("No se puede ir más allá");
        }
        localStorage.setItem(projectId, JSON.stringify(projectObj));
    }
}

function projectStateBackward(){
    let projectId = this.parentNode.id;
    let projectString = localStorage.getItem(projectId);
    let projectObj = JSON.parse(projectString);
    if((projectObj.id).includes("project-")){
        if(projectObj.projectDone == 2){
            projectObj.projectDone = 1;
            this.parentNode.children[4].classList.toggle("hidden");
            inProcessContainer.appendChild(this.parentNode);       
        }else if(projectObj.projectDone == 1){
            projectObj.projectDone = 0;
            this.parentNode.children[0].classList.toggle("hidden");
            todoContainer.appendChild(this.parentNode);
        }else {
            window.alert("No se puede ir más allá");
        }
        localStorage.setItem(projectId, JSON.stringify(projectObj));
    }
}


function createDirectionArrowRight() {
    let span = document.createElement("span");
    // span.className = "material-symbols-outlined arrowRight hidden"; 
    span.className = "material-symbols-outlined arrowRight"; 
    span.innerText = "arrow_forward_ios";
    return span;
}
function createDirectionArrowLeft() {
    let span = document.createElement("span");
    // span.className = "material-symbols-outlined arrowLeft hidden"
    span.className = "material-symbols-outlined arrowLeft"
    span.innerText = "arrow_back_ios";
    return span;
}
function createTrashIcon() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined trash";
    span.innerText = "delete";
    return span;
}
function deleteProject() {
    let confirmation = window.confirm("¿Deseas borrar definitivamente? Es un proceso irreversible.");
    if(confirmation){
        this.parentNode.remove();
        let projectId = this.parentNode.id;
        localStorage.removeItem(projectId);
    }else{
        return;
    }
}

function recoverTaskFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let projectObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if((projectObj.id).includes("project-")){
            let projectHTML = createRecoveredProjectFromLocalStorage(projectObj);
            if (projectObj.projectDone == 2) {
                doneContainer.appendChild(projectHTML);
            }else if(projectObj.projectDone == 1){
                inProcessContainer.appendChild(projectHTML);
            } else {
                todoContainer.appendChild(projectHTML);
            }
        }
    }
}

function createRecoveredProjectFromLocalStorage(projectObj) {
    let div = document.createElement('div');
    div.className = "project";
    div.id = projectObj.id;  
    div.draggable = "true";//marcar el project draggable
    div.setAttribute("ondragstart","drag(event)");//añadir el atributo que inicio el proceso de arrastre
    let name = createProjectName(projectObj.projectName);
    name.addEventListener('click', openProject);
    let title = createProjectTitle(projectObj.projectTitle);
    title.addEventListener('click', openProject);
    let description = createProjectDescription(projectObj.projectDescription);
    description.addEventListener('click', openProject);
    let arrowLeft = createDirectionArrowLeft()
    let arrowRight = createDirectionArrowRight();
    div.appendChild(arrowLeft);
    // arrowLeft.addEventListener('click', showStateArrow(projectObj.id));
    // arrowLeft.addEventListener('click', projectState);//Falla projectState
    arrowLeft.addEventListener('click', projectStateBackward);
    if (projectObj.projectDone == 0) {
        arrowLeft.classList.add('hidden');
    }
    div.appendChild(name);
    div.appendChild(title);
    div.appendChild(description);
    div.appendChild(arrowRight);
    // arrowRight.addEventListener('click', showStateArrow(projectObj.id));//el id es el mismo para el objeto y para el div que lo muestra
    // arrowRight.addEventListener('click', projectState);//Falla projectState
    arrowRight.addEventListener('click', projectStateForward);
    if (projectObj.projectDone == 2){  
        arrowRight.classList.add('hidden')
    }
    let erase = createTrashIcon();
    div.appendChild(erase);
    erase.addEventListener('click', deleteProject);
    return div;
}

function openProject(event){
    // Obtener el elemento que desencadenó el evento
    var clickedProject = event.target;

    // Crear un nuevo elemento div para el popup
    var popup = document.createElement('div');
    popup.className = 'popup';

    // Clonar el elemento clickeado y ajustar su tamaño
    var enlargedProject = clickedProject.parentNode.cloneNode(true);
    let close = createCloseIcon(); 
    enlargedProject.appendChild(close);
    close.addEventListener('click', deletePopUp);
    enlargedProject.children[0].classList.add('hidden');
    enlargedProject.children[4].classList.add('hidden');
    enlargedProject.children[5].classList.add('hidden');
    enlargedProject.style.width = '600px'; // Ajustar el ancho según sea necesario
    // Agregar el elemento clonado al popup
    popup.appendChild(enlargedProject);
    // Agregar el popup al body del documento
    if(document.body.children.id != "popup"){

    }
    document.body.appendChild(popup);
}
function createCloseIcon() {
    let span = document.createElement("span");
    span.className = "material-symbols-outlined close";
    span.innerText = "close";
    return span;
}
function deletePopUp() {
    this.parentNode.remove();
}
// <button id="add-task-btn"><span class="material-symbols-outlined">
// arrow_forward_ios
// </span></button>