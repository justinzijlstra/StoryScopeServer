
const deleteText = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteRapper)
})

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

async function deleteRapper(){
    const sName = this.parentNode.childNodes[1].innerText
    const bName = this.parentNode.childNodes[3].innerText
    try{
        const response = await fetch('deleteRapper', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'stageNameS': sName,
              'birthNameS': bName
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function addLike(){
    const sName = this.parentNode.childNodes[1].innerText
    const bName = this.parentNode.childNodes[3].innerText
    const tLikes = Number(this.parentNode.childNodes[5].innerText)
    try{
        const response = await fetch('addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'stageNameS': sName,
              'birthNameS': bName,
              'likesS': tLikes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//sections==================================================================
const drawingSections = document.querySelectorAll('.drawSection')

Array.from(drawingSections).forEach((element)=>{
  //console.log(element.childNodes) //all nodes
  element.childNodes[9].height = element.childNodes[7].height
  element.childNodes[9].width = element.childNodes[7].width
  // console.log(element.childNodes[9]) //dit is het canvas
})
//sections==================================================================
//RAPPERS==================================================================
//SAVING==================================================================

const canvas = document.querySelectorAll('.draw');
const imgSpace  = document.querySelector('#displayDrawing')
const picCode = document.querySelector('#spanWithPictureCode');
const saveButtons = document.querySelectorAll(".saveButton");

Array.from(saveButtons).forEach((element)=>{
  element.addEventListener('click', () => trySave(element))
})
//TODO: Ik moet de canvas info dataURI hierheen of naar de server krijgen
async function trySave(name){

  const drawingName = String(name.name);
  //const dataURI = canvas.toDataURL();//TODO: dit moet dus specifiek worden 
  const x = document.querySelector('#' + drawingName)
  console.log(x + " hoi")
  const dataURI = x.toDataURL()
  console.log(dataURI)
  //TODO: dataURI werkt hier,

  try
  {
    // const response = await fetch('/saveDrawing', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //         name : drawingName,
    //         itsMyData: dataURI
    //     })
    //   })
    // const data = await response.json()
    
    // location.reload()

  }
  catch(err)
  {
    console.log(err)
  }

}


// async function tryLoad(name){

//   const drawingName = String(name.name);

//   try
//   {
//     const response = await fetch('/loadOriginalSprite', //TODO:Dit moet de orignele tekening laden als je terug wilt
//     {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//          name: drawingName
//       })
//     })
//     const data = await response.json()
//     console.log(data);
//      location.reload()
//   }
//   catch(err)
//   {
//       console.log(err)
//   }
// }


function tryLoadImg(){
  // /imgSpace.src = picCode.innerText;
}
tryLoadImg()


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
   console.log("hello")
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