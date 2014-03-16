var c = document.getElementById('c'),
    o = c.getContext('2d');
var wordToWrite;
var inputWord;
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

    //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);

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
} initTouch();
var drag = false, lastX, lastY;
c.onmousedown = MouseDown;
function MouseDown(e){ drag = true; lastX = 0; lastY = 0; e.preventDefault(); c.onmousemove(e) }
c.onmouseup   = MouseUp;
function MouseUp(e) { drag = false; e.preventDefault(); runOCR() }
c.onmousemove = MouseMove;
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


var lastWorker;
var worker = new Worker('worker.js')

function runOCR(image_data, raw_feed)
{
    document.getElementById("output").className = 'processing'
    worker.onmessage = function(e)
    {

        document.getElementById("output").className = ''

        if('innerText' in document.getElementById("text"))
        {
            document.getElementById("text").innerText = e.data
            inputWord= e.data.toString();
        }
        else
        {
            document.getElementById("text").textContent = e.data
            inputWord= e.data.toString();
        }
    }
    var start = Date.now()
    if(!raw_feed){
        image_data = o.getImageData(0, 0, c.width, c.height);
    }

    worker.postMessage(image_data)
    lastWorker = worker;
}
reset_canvas();

runOCR();



function getWord()
{
    var  words= ['Apple',"Pear"];
    wordToWrite=word;
    if('innerText' in document.getElementById("textModel"))
    {
        document.getElementById("textModel").innerText = word
    }
    else
    {
        document.getElementById("textModel").textContent = word
    }
}
function verify()
{   inputWord=inputWord.substring(0,inputWord.length-1);
    if(wordToWrite.localeCompare(inputWord)!=0)
        alert(wordToWrite.toString()+"wrong"+inputWord.toString());
    else
        alert("good");
}
