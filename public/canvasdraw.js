let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array

let tool=canvas.getContext("2d");//api
let mouseDown = false;
tool.strokeStyle=penColor
tool.lineWidth=penWidth

// changing color of pen through event listner
pencilColor.forEach((colorelem)=>{
    colorelem.addEventListener("click",(e)=>{
        let color=colorelem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    })
})

//changing width of pencil through event listner
pencilWidthElem.addEventListener("change",(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth;
})
// changing width of eraser through event listner
eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
})
// event listner on eraser that will have white color when selected and pencolor if not selected
eraser.addEventListener("click",(e) => {
    if (eraserflag==true) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

canvas.addEventListener("mousedown",(e)=>{
    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown){
        let data={
            x: e.clientX,
            y: e.clientY,
            color:eraserflag?eraserColor:penColor,
            width:eraserflag?eraserWidth:penWidth,
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup",(e)=>{
    mouseDown=false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})
function beginPath(strokeObj)
{
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj)
{
    tool.strokeStyle=strokeObj.color,
    tool.lineWidth=strokeObj.width,
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();// canvas me jo graphic hai usko url me convert

    let a =document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})