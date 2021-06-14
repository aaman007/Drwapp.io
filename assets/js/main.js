const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight - 160;

const context = canvas.getContext("2d");
const defaultBackground = "white";
context.fillStyle = defaultBackground;
context.fillRect(0, 0, canvas.width, canvas.height);

let drawColor = "black"
let drawWidth = "2";
let isDrawing = false;
let currentStack = [], poppedStack = [];

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("mousedown", start, false);

canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);


function changeColor(element, isColorPicker=false) {
    if (isColorPicker) {
        drawColor = element.value;
    }
    else {
        drawColor = element.style.background;
    }
}

function changeWidth(element) {
    drawWidth = element.value;
}

function start(event) {
    event.preventDefault();

    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function stop(event) {
    event.preventDefault();

    if (isDrawing) {
        isDrawing = false;
        context.stroke();
        context.closePath();

        currentStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    }
}

function draw(event) {
    if (isDrawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
}

function clearCanvas() {
    context.fillStyle = defaultBackground;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);    
}

function redoLast() {
    if (poppedStack.length) {
        currentStack.push(poppedStack.pop());
        context.putImageData(currentStack[currentStack.length-1], 0, 0);
    }
}

function undoLatest() {
    if (currentStack.length <= 1) {
        poppedStack.push(currentStack.pop());
        clearCanvas();
    }
    else {
        poppedStack.push(currentStack.pop());
        context.putImageData(currentStack[currentStack.length-1], 0, 0);
    }
}