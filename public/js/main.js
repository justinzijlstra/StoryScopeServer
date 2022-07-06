//sections==================================================================
const drawingSections = document.querySelectorAll('.drawSection')

Array.from(drawingSections).forEach((element)=>{
  //console.log(element.childNodes) //all nodes
  element.childNodes[9].height = element.childNodes[7].height
  element.childNodes[9].width = element.childNodes[7].width
  // console.log(element.childNodes[9]) //dit is het canvas
})
//sections==================================================================
//SAVING==================================================================

// character
// sprite
// dataURI

const canvas = document.querySelectorAll('.draw');
const imgSpace  = document.querySelector('#displayDrawing')
const picCode = document.querySelector('#spanWithPictureCode');
const saveButtons = document.querySelectorAll(".saveButton");
const loadButtons = document.querySelectorAll(".loadButton");

Array.from(saveButtons).forEach((element)=>{
  element.addEventListener('click', () => trySave(element))
})
Array.from(loadButtons).forEach((element)=>{
  element.addEventListener('click', () => tryLoadOriginal(element))
})


async function trySave(element){
  
  const currentChar = String(element.name);
  const currentSpriteID = String(element.id);
  const currentDataURI = document.querySelector(`#${currentSpriteID}`).toDataURL();

  //saveLogs()
  
  try
  {
    const response = await fetch('/saveSprite', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            character: currentChar,
            sprite : currentSpriteID,
            dataURI: currentDataURI
        })
      })
    const data = await response.json()
    console.log(`this is data: ${data}`)
    location.reload()
  }
  catch(err)
  {
    console.log(err)
  }
}

function saveLogs(){
   console.log(`saving character: ${currentChar}`);
   console.log(`saving sprite: ${currentSpriteID}`);
   console.log(`saving dataURI: ${currentDataURI}`);
}

async function tryLoadOriginal(element){

  const ogChar = String(element.name);
  const ogSprite = String(element.value);
  //loadLogs();

  try
  {
    const response = await fetch('/loadOriginalSprite',
    {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
         character: ogChar,
         sprite: ogSprite
      })
    })
    const data = await response.json()
    location.reload()
  }
  catch(err)
  {
      console.log(err)
  }
}

function loadLogs(){
  console.log(`character: ${ogChar}`)
  console.log(`sprite: ${ogSprite}`)
}
//SAVING==================================================================
//DRAWING==================================================================

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// ctx.globalCompositeOperation = 'multiply';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;
let ctx;

function draw(e) {
  if(ctx != e.path[0].getContext('2d')) ctx = e.path[0].getContext('2d');

  ctx.strokeStyle = '#BADA55';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 50;

  if (!isDrawing) return; // stop the fn from running when they are not moused down
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  // start from
  ctx.moveTo(lastX, lastY);
  // go to
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  // hue++;
  // if (hue >= 360) {
  //   hue = 0;
  // }
  if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
    direction = !direction;
  }

  if(direction) {
    ctx.lineWidth++;
  } else {
    ctx.lineWidth--;
  }
}


function activeCanvas(canvasElement){
   ctx = canvasElement.getContext('2d');
}

Array.from(canvas).forEach((element)=>{
  element.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });
  
  
  element.addEventListener('mousemove', draw, activeCanvas(element));
  element.addEventListener('mouseup', () => isDrawing = false);
  element.addEventListener('mouseout', () => isDrawing = false);
})