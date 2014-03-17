var c,o;
var gameObjects=[];
var wordToWrite;
var inputWord;
var drag = false, lastX, lastY;
var lastWorker;
var worker;
window.onload=startGame;
window.onresize=startGame();
function startGame()
{
    c = document.getElementById('c');
    o = c.getContext('2d');
    c.width= document.getElementById('demo').offsetWidth;
    c.height= c.width/2.5;
    initTouch();
    initMouse(c);
    worker= new Worker('worker.js');
    reset_canvas();
    initGameObjects();
    getWord();
}

function reset_canvas(){
    o.fillStyle = 'white'
    o.fillRect(0, 0, c.width, c.height)
    o.fillStyle = 'black'
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function initTouch() {
    c.addEventListener('touchstart', touchHandler, true);
    c.addEventListener('touchmove', touchHandler, true);
    c.addEventListener('touchend', touchHandler, true);
    c.addEventListener('touchcancel', touchHandler, true);
}
function initMouse(c)
{
    c.onmousedown = MouseDown;
    c.onmouseup   = MouseUp;
    c.onmousemove = MouseMove;
}

function MouseDown(e)
{   drag = true;
    lastX = 0;
    lastY = 0;
    e.preventDefault();
    c.onmousemove(e)
}

function MouseUp(e)
{ drag = false;
  e.preventDefault();
  runOCR();
}

function MouseMove(e){
    e.preventDefault()
    var rect = c.getBoundingClientRect();
    var r = 5;

    function dot(x, y){
        o.beginPath()
        o.moveTo(x + r, y)
        o.arc(x, y, r, 0, Math.PI * 2)
        o.fill()
    }
    if(drag){
        var x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        if(lastX && lastY){
            var dx = x - lastX, dy = y - lastY;
            var d = Math.sqrt(dx * dx + dy * dy);
            for(var i = 1; i < d; i += 2){
                dot(lastX + dx / d * i, lastY + dy / d * i)
            }
        }
        dot(x, y)

        lastX = x;
        lastY = y;
    }
}

function runOCR(image_data, raw_feed)
{
    //document.getElementById("output").className = 'processing'
    worker.onmessage = function(e)
    {
            inputWord= e.data.toString();

    }
    var start = Date.now()
    if(!raw_feed){
        image_data = o.getImageData(0, 0, c.width, c.height);
    }
    worker.postMessage(image_data)
    lastWorker = worker;
}

function getWord()
{   var random=Math.floor((Math.random()*10)+1);
    wordToWrite=gameObjects[random].ObjectName;
    if('innerText' in document.getElementById("textModel"))
    {
        document.getElementById("textModel").innerText = wordToWrite;
    }
    else
    {
        document.getElementById("textModel").textContent = wordToWrite;
    }
    show_image(gameObjects[random], 'image');
}

function GameObject(imagePath,name)
{
    this.ImagePath=imagePath;
    this.ObjectName=name;

}

function initGameObjects()
{
    var obj= new GameObject("Images/Apple.png",'APPLE');
    gameObjects.push(obj);
    obj= new GameObject("Images/Pear.png",'PEAR');
    gameObjects.push(obj);
    obj= new GameObject("Images/Cherry.png",'CHERRY');
    gameObjects.push(obj);
    obj= new GameObject("Images/Grapes.png",'GRAPE');
    gameObjects.push(obj);
    obj= new GameObject("Images/Kiwi.png",'KIWI');
    gameObjects.push(obj);
    obj= new GameObject("Images/Lemon.png",'LEMON');
    gameObjects.push(obj);
    obj= new GameObject("Images/Peach.png",'PEACH');
    gameObjects.push(obj);
    obj= new GameObject("Images/Plum.png",'PLUM');
    gameObjects.push(obj);
    obj= new GameObject("Images/Orange.png",'ORANGE');
    gameObjects.push(obj);
    obj= new GameObject("Images/Melon.png",'MELON');
    gameObjects.push(obj);
}

function show_image(obj, divId) {
    var image1=new Image();
    image1.src=obj.ImagePath;
    image1.onload=function()
    {
        var div=document.getElementById(divId);
        div.style.height=document.getElementById('demo').offsetHeight+"px";
        div.style.backgroundImage="url("+this.src+")";
        div.style.backgroundSize="70% auto";
        div.style.backgroundRepeat="no-repeat";
        div.style.backgroundPosition="center center";
    };
}

function center(objSize, relObj)
{
    var container=document.getElementById(relObj);
    var height= container.offsetHeight;
    return (height-objSize)/2;
}

function verify()
{   inputWord=inputWord.substring(0,inputWord.length-1).toUpperCase();
    inputWord = inputWord.replace(/\s+/g, " ");
    if(wordToWrite.localeCompare(inputWord)!=0)
        alert(wordToWrite.toString()+"wrong"+inputWord.toString());
    else
        alert("good");
}
