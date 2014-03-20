var c,o;
var gameObjects=[];
var wordToWrite;
var inputWord;
var drag = false, lastX, lastY;
var lastWorker;
var worker;
window.onload=displayMenu();
window.onresize=displayMenu();
function startGame(Objtype)
{
    //make other section invisible
    document.getElementById('menu').style.display='none';
    document.getElementById('game').style.display='block';

    c = document.getElementById('c');
    o = c.getContext('2d');
    c.width= document.getElementById('demo').offsetWidth;
    c.height= c.width/2.5;
    initTouch();
    initMouse(c);
    worker= new Worker('worker.js');
    reset_canvas();
    initGameObjects(Objtype);
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
{
    reset_canvas();
    var random=Math.floor((Math.random()*10));
    wordToWrite=gameObjects[random].ObjectName;
    show_image(gameObjects[random], 'image');
    if('innerText' in document.getElementById("textModel"))
    {
        document.getElementById("textModel").innerText = wordToWrite;
    }
    else
    {
        document.getElementById("textModel").textContent = wordToWrite;
    }
    gameObjects[random].Sound.play();

}

function GameObject(imagePath,name, sound)
{
    this.ImagePath=imagePath;
    this.ObjectName=name;
    this.Sound=sound;

}

function sound(name)
{
    return new buzz.sound("Audio/"+name,
        {
            formats: [ "ogg", "mp3", "wav" ],
            preload: true,
            autoplay: false,
            loop: false
        });
}

function initGameObjects(objType)
{  gameObjects=[];
   if(objType=="fruits")
   {
        var obj= new GameObject("Images/Fruits/Apple.png",'APPLE', sound("Fruits/Apple"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Pear.png",'PEAR',sound("Fruits/Pear"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Cherry.png",'CHERRY',sound("Fruits/Cherry"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Grapes.png",'GRAPES',sound("Fruits/Grapes"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Kiwi.png",'KIWI',sound("Fruits/Kiwi"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Lemon.png",'LEMON',sound("Fruits/Lemon"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Peach.png",'PEACH',sound("Fruits/Peach"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Plum.png",'PLUM',sound("Fruits/Plum"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Orange.png",'ORANGE',sound("Fruits/Orange"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Fruits/Melon.png",'MELON',sound("Fruits/Melon"));
        gameObjects.push(obj);
   }
    if(objType=="vegetables")
    {
        var obj= new GameObject("Images/Vegetables/Cabbage.png",'CABBAGE',sound("Vegetables/Cabbage"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Carrot.png",'CARROT',sound("Vegetables/Carrot"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Garlic.png",'GARLIC',sound("Vegetables/Garlic"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Lettuce.png",'LETTUCE',sound("Vegetables/Lettuce"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Onion.png",'ONION',sound("Vegetables/Onion"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Pepper.png",'PEPPER',sound("Vegetables/Pepper"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Potato.png",'POTATO',sound("Vegetables/Potato"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Radish.png",'RADISH',sound("Vegetables/Radish"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Spinach.png",'SPINACH',sound("Vegetables/Spinach"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Vegetables/Tomato.png",'TOMATO',sound("Vegetables/Tomato"));
        gameObjects.push(obj);
    }
    if(objType=="animals")
    {
        var obj= new GameObject("Images/Animals/Bunny.jpg",'BUNNY',sound("Animals/Bunny"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Cat.jpg",'CAT',sound("Animals/Cat"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Cow.jpg",'COW',sound("Animals/Cow"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Dog.jpg",'DOG',sound("Animals/Dog"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Duck.jpg",'DUCK',sound("Animals/Duck"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Goat.jpg",'GOAT',sound("Animals/Goat"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Horse.jpg",'HORSE',sound("Animals/Horse"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Lamb.jpg",'LAMB',sound("Animals/Lamb"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Sheep.jpg",'SHEEP',sound("Animals/Sheep"));
        gameObjects.push(obj);
        obj= new GameObject("Images/Animals/Hen.jpg",'HEN',sound("Animals/Hen"));
        gameObjects.push(obj);
    }

}


function show_image(obj, divId) {
    var image1=new Image();
    image1.src=obj.ImagePath;
    image1.onload=function()
    {
        var div=document.getElementById(divId);
        div.style.height=document.getElementById('demo').offsetHeight+"px";
        div.style.backgroundImage="url("+this.src+")";
        div.style.backgroundSize="80% auto";
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

    {  bootbox.dialog({
            message: inputWord.toString()+
                "<div class='text-center'><br/><img src='../Images/sad.gif~c200'/></div>",
            title: "<b>You got it wrong</b>",
            className:"text-center",
            onEscape: function() {
                reset_canvas();
            },
            buttons:
            {
                retry:
                {
                    label: "&#8635;Retry ",
                    className: "btn btn-lg btn-info",
                    callback: function() {
                        reset_canvas();
                    }

                }
            }
        });
      }
        //alert(wordToWrite.toString()+"wrong"+inputWord.toString());

    else
    {
        toast();
        getWord();
    }
}

function displayImg(src,elem)
{

    var image1 = new Image();
    image1.src = src;
    image1.onload = function () {
        var div = document.getElementById(elem);
        div.style.height = 0.95*window.innerHeight / 2 + "px";
        div.style.backgroundImage = "url(" + this.src + ")";
        if(elem=="dog"||elem=="vegetables")
            div.style.backgroundSize = "50% auto";
        else
            div.style.backgroundSize = "60% auto";
        div.style.backgroundRepeat = "no-repeat";
        if(elem=="dog"||elem=="vegetables")
            div.style.backgroundPosition = "right center ";
        else
            div.style.backgroundPosition = "center center";
    };
}
function displayMenu()
{
    document.getElementById('menu').style.display='block';
    document.getElementById('game').style.display='none';
    displayImg("Images/Dog.gif", "dog");
    displayImg("Images/Animals.png", "animals");
    displayImg("Images/Fruits.png", "fruits");
    displayImg("Images/Vegetables.png", "vegetables");
}

function playSound(word)
{
    var audio = new Audio();
    audio.src ='http://translate.google.com/translate_tts?tl=en&q='+word+'%20';
    audio.play();
}
function toast()
{
    toastr.options=
    {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.info("+20 Points","GOOD!");

}
