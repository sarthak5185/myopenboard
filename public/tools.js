let toolscont = document.querySelector(".tools-cont")
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let optionsCont = document.querySelector(".options-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionsflag = true;
let pencilflag = false;
let eraserflag = false;
optionsCont.addEventListener("click", (e) => {
    optionsflag = !optionsflag;
    if (optionsflag) {
        opentools();
    }
    else {
        closetools();
    }
})
function opentools() {
    let iconele = optionsCont.children[0];
    iconele.classList.remove("fa-times");
    iconele.classList.add("fa-bars");
    toolscont.style.display = "flex";
    //     pencilToolCont.style.display="flex";
    //     eraserToolCont.style.display="flex";
    // 
}
function closetools() {
    let iconele = optionsCont.children[0];
    iconele.classList.remove("fa-bars");
    iconele.classList.add("fa-times");
    toolscont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}
pencil.addEventListener("click", (e) => {
    // true show pencil tool
    // false hide pencil tool
    pencilflag = !pencilflag;
    if (pencilflag == true) {
        pencilToolCont.style.display = "block";
    }
    else {
        pencilToolCont.style.display = "none";
    }
})
eraser.addEventListener("click", (e) => {
    // true show pencil tool
    // false hide pencil tool
    eraserflag = !eraserflag;
    if (eraserflag == true) {
        eraserToolCont.style.display = "flex";
    }
    else {
        eraserToolCont.style.display = "none";
    }
})
sticky.addEventListener("click", (e) => {

    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
})
upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let uploadTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
    <img src="${url}"/>
    </div>
    `;
        createSticky(uploadTemplateHTML);
    })
})
function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = document.querySelector(".minimize");
    let remove = document.querySelector(".remove");

    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}
function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

