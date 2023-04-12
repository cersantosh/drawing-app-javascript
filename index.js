/* 

Remember these things :
9. to draw on canvas first we click and then we move mouse
1. use getImageData to store each pixel data and putImageData()
2. to erase just change color to white
3. use download attribute of a tag to download any file
4. canvas.toDataUrl() convert canvas data to image
5. use offsetX and offsetY to get position relative to element where it is clicked
6. set canvas.offsetWidth and canvas.offsetHeight so that drawing will be drawn according to mouse pointer
7. to make background white while saving set color of entire canvas to white
8. first know whick option is clicked and do according to it
10. lineTo() draw line while moveTo() set the starting point and it will not draw anything

*/



// creating drawing area

function createGameArea() {
  let canvas = document.createElement("canvas");
  canvas.id = "canvas";
  document.querySelector(".drawing-board").append(canvas);
  return canvas;
}
let canvas = createGameArea();

// to make mouse position to draw correctly
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setBackground()
});

// to make background white while saving image
function setBackground(){
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
let ctx = canvas.getContext("2d");
// default line size and default selected option 'brush'
let lineSize = 3;
let selectedShape = "brush";
// this is required while drawing different shape
let previousMouseX = null;
let previousMouseY = null;
let snapshot = null
// to know whether fill color option is checked or not
let fillColor = false

// default drawing color
let selectedColor = "black"

// knowing user clicked on fill color option or not
document.querySelector("#fill-color").addEventListener("click", () => {
  fillColor = document.querySelector("#fill-color").checked
})


// always remember while drawing we first click and then we move mouse
canvas.addEventListener("mousedown", (event) => {
  ctx.fillStyle = selectedColor
  // getting mouse position when user cliked on canvas
  previousMouseX = event.offsetX;
  previousMouseY = event.offsetY;
  ctx.beginPath();
  ctx.lineWidth = lineSize;
  // this save pixel data of rectangular box
  // useful in drawing triangle, circle and rectangle
  // we don't need to clear previous shape drawn
  // it takes 4 arguments(rectangular box)
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
  canvas.addEventListener("mousemove", draw);
});

// when user release mouse we stop drawing
document.addEventListener("mouseup", () => {
  canvas.removeEventListener("mousemove", draw);
});


// first knowing which option is clicked by user
// id is specify to perform this action
function draw(event) {
  // copying the data
  ctx.putImageData(snapshot, 0, 0)
  // erasing means simply change color to white
  if (selectedShape === "brush" || selectedShape == "erase") {
    drawAnything(event);
  } else if (selectedShape === "rectangle") {
    drawRectangle(event);
  } else if (selectedShape === "circle") {
    drawCircle(event);
  } else if (selectedShape === "triangle") {
    drawTriangle(event);
  }
}

// line to is used to draw line while move to don't draw line but specify starting point
// event.offsetX gives the position of mouse pointer relative to where it is clicked
function drawAnything(event) {
  ctx.lineTo(event.offsetX, event.offsetY);
 ctx.stroke();

//  to erase just changing color to white
 if(selectedShape === "erase"){

   ctx.strokeStyle = "white" 
 }
}


// changing color when user clickd on different color options
// giving outline to show the active clicked option
function changeColor(element, color) {
  // first removing the outline from other options if it is already clicked
  let colors = document.querySelectorAll(".selected-color");
  for (let i of colors) {
    i.classList.remove("selected-color");
  }
  element.classList.add("selected-color");

  // changing drawing color according to the user clicked color
  ctx.strokeStyle = color;
  ctx.fillStyle = color
  selectedColor = color
}

// chaning size of brush and eraser
function changeSize(size) {
  lineSize = size;
  ctx.lineWidth = size;
}

// clearing entire canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// selecting user clicked shape and changing color and background of selected shape
function selectShape(element) {
  if(element.id === "brush" || element.id === "erase"){
    document.querySelector("#fill-color").checked = false
  }
  let shapes = document.querySelectorAll(".active");
  for (let i of shapes) {
    i.classList.remove("active");
  }
  element.classList.add("active");
  selectedShape = element.id;
}


// if user clicked fill color then use fillRect otherwise strokeRect
function drawRectangle(event) {
  width = event.offsetX - previousMouseX;
  height = event.offsetY - previousMouseY;
  fillColor ? ctx.fillRect(previousMouseX, previousMouseY, width, height) : ctx.strokeRect(previousMouseX, previousMouseY, width, height)
}

function drawCircle(event) {
  let radius = Math.sqrt(Math.pow(previousMouseX - event.offsetX, 2) + Math.pow(previousMouseX - event.offsetX, 2))
  ctx.beginPath()
  ctx.arc(previousMouseX, previousMouseY, radius, 0, Math.PI * 2)
  fillColor ? ctx.fill() : ctx.stroke()
}

function drawTriangle(event) {
  console.log(previousMouseX * 2 - event.offsetX)
  ctx.beginPath()
  ctx.moveTo(previousMouseX, previousMouseY)
  ctx.lineTo(event.offsetX, event.offsetY)
  // drawing bottom line
  ctx.lineTo(previousMouseX * 2 - event.offsetX, event.offsetY)
  ctx.closePath()

  fillColor ? ctx.fill() : ctx.stroke()


}

// use download attribute of a tag to download any file
function saveAsImage(){
  let a = document.createElement("a")
  a.download = `${Date.now()}.jpg`
  // it will convert drawing to image
  a.href = canvas.toDataURL()
  console.log(a.href)
  a.click()

}