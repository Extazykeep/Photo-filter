let initialImageHeight = 0;
let initialImageWidth = 0;
const fullScreenButton = document.querySelector(".fullscreen");
const filtersBlock = document.querySelector(".filters");
const resetButton = document.querySelector(".btn-reset");
const image = document.querySelector("img");
const pictureLoader = document.querySelector(".btn-load--input");
const inputs  = filtersBlock.querySelectorAll("input");
const nextPicture = document.querySelector(".btn-next");
const values = {"blur" : "px",
                "invert" : "%",
                "sepia" : "%",
                "saturate": "%",
                "hue-rotate": "deg"
                };
const currentTime = new Date().getHours();
const downloadButton = document.querySelector(".btn-save");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
let currentTimeofDay = ""; 
let counter = 1;
// eventlisteners section
filtersBlock.addEventListener("input", inputHandler);
resetButton.addEventListener("click", resetEverything);
fullScreenButton.addEventListener("click", fullScreenToggler);
pictureLoader.addEventListener("input", imageHandler);
nextPicture.addEventListener("click", pictureNext);
downloadButton.addEventListener("click", imageDownloader);
image.addEventListener("load", imageLoaded)
///other things
function setcurrentTimeofDay(){
  if(currentTime >= 6 && currentTime <= 11) {
    currentTimeofDay = "morning";
  }
  if(currentTime >= 12 && currentTime <= 17) {
    currentTimeofDay = "day";
  }
  if(currentTime >= 18 && currentTime <= 23) {
    currentTimeofDay = "evening";
  }
  if(currentTime >= 0 && currentTime <= 5) {
    currentTimeofDay = "night";
  }
}
setcurrentTimeofDay()
function inputHandler(ev){
    let currentValue = ev.target.value;
    ev.target.nextElementSibling.innerHTML = `${currentValue}`;
    image.style.setProperty(`--${ev.target.name}`, `${ev.target.value}${values[ev.target.name]}`)
}
function fullScreenToggler(){
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
}
/// resseting styles block
function resetEverything() {
  resetImageStyles();
  resetInputs();
  resetCanvasStyle();
}

function resetImageStyles() {
  image.setAttribute("style", "");
}
function resetInputs(){
  inputs.forEach((input) => {
    input.value = input.getAttribute("value");
    input.nextElementSibling.innerHTML = input.getAttribute("value");
  })
}
function imageHandler(event) {
 //image.setAttribute("crossorigin","anonymous");
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = ev => {
    image.src = `${ev.target.result}`;
  }
  setCanvasSizes();
  reader.readAsDataURL(file)
  event.target.value = '';

}
function pictureNext(){
// image.setAttribute("crossorigin","anonymous");
  let imagesrc = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${currentTimeofDay}/${counter < 10? "0"+ counter : counter}.jpg`
  image.src = imagesrc;
  counter++
  if(counter === 21) {
    counter = 1;
  }
}
//experimental
function imageLoaded(){
  setInitialSizes();
  setCanvasSizes();
}
function setInitialSizes(){
initialImageHeight = image.naturalHeight;
initialImageWidth = image.naturalWidth;
}
function setCanvasSizes(){
  canvas.width = initialImageWidth;
  canvas.height = initialImageHeight;
}
function imageDownloader() {
  drawImageIntoCanvas();
}
function drawImageIntoCanvas() {
  const picture = new Image();
  picture.src = image.src;
  picture.crossOrigin = "Anonymous";
  picture.addEventListener("load", ()=>{
    ctx.drawImage(picture,0,0);  
  })
  setupFiltersForImage();
}
function resetCanvasStyle(){
  console.log(ctx.filter)
  ctx.filter = "none";
  console.log(ctx.filter)
}
function setupFiltersForImage(){
  const koeff = image.width / initialImageWidth;
  let styles = "";
  if(image.getAttribute("style")) {
    styles = image.getAttribute("style").split(" ")
    .map((item)=> item.replace("--",""))
    .map((item)=> item.replace(":", "("))
    .map((item)=> item.replace(";", ")"))
  }
  for(let i = 0; i < styles.length; i++) {
    if(styles[i].includes("blur")){
      let number = parseInt(styles[i].replace(/[^\d]/g, ''));
      styles[i] = `blur(${Math.round(number/koeff)}px)`
    }
  }
  if(image.getAttribute("style")){
    ctx.filter = `${styles.join(" ")}`;
  }
  setTimeout(downloadImage, 300);
}
function downloadImage(){
  const link = document.createElement('a');
  link.download = 'filteredimage.png';
  link.href = document.querySelector('canvas').toDataURL();
  link.click();
}
imageLoaded()
