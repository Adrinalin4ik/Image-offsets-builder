const PointRecord = require('./point_record.js')
const CodeMirror = require('codemirror')
var beautify_js = require('js-beautify').js_beautify
const remote = require('electron').remote;
var robot = remote.require("robotjs");

var textarea = document.getElementById('object_editor')
var editor = CodeMirror.fromTextArea(textarea,{
  value: textarea.value,
  lineNumbers: true,
  matchBrackets: true,
  mode:"text/json"
});

pr = new PointRecord("test", 10)

pr.onchange(()=> {
  const str = JSON.stringify(pr.colorObject);
  var formattedJSON = beautify_js(str, { indent_size: 2 });
  editor.getDoc().setValue(formattedJSON);
  // editor.autoFormatRange(0, str.length);
})
var scale=40;
var transformScale = 1;

var width = 100,
    height = 200;

var canvas = document.getElementById("canvas"),
    ctx  = canvas.getContext("2d")

canvas.style ="transform: scale("+transformScale+");"

var img = robot.screen.capture(0, 0, width, height);


$(canvas).attr("width",width*scale);
$(canvas).attr("height", height*scale);

$panzoom = $(canvas).panzoom({
  cursor: "auto",
});
$panzoom.parent().on('mousewheel.focal', function( e ) {
  e.preventDefault();
  var delta = e.delta || e.originalEvent.wheelDelta;
  var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
  $panzoom.panzoom('zoom', zoomOut, {
    minScale: 0,
    animate: false,
    focal: e
  });
});



function drawImageGrid(scale) {
  // alert(scale)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.removeEventListener('dblclick', handleClick);

  canvas.addEventListener('dblclick', handleClick);

  let boxSize = 1*scale

  ctx.lineWidth = 0.5;


  function render() {
    let d1 = new Date();
    for (var row = 0; row < width; row++) {
        for (var column = 0; column < height; column++) {
            var x = column * boxSize;
            var y = row * boxSize;
            var color = img.colorAt(row, column);
            // var color="black"
            drawRect(x, y, color)
        }
    }
    let d2 = new Date()
    console.log( d2-d1)
  }
  
  function drawRect(x, y, color){
      
      setTimeout(()=>{
        ctx.beginPath();
        ctx.rect(y, x, boxSize, boxSize);
        ctx.fillStyle = "#"+color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      })
  }

  function handleClick(e) {
    console.log("click")
    ctx.strokeStyle = "red";
    let x = Math.floor(e.offsetX / boxSize) * boxSize,
        y = Math.floor(e.offsetY / boxSize) * boxSize
    console.log(x/boxSize,y/boxSize)
    ctx.strokeRect(x,y,boxSize, boxSize);

    const realX = x/boxSize,
          realY = y/boxSize,
          color = img.colorAt(realX, realY);
    pr.setNewPoint(realX, realY, color);
  }


  render();
}

drawImageGrid(scale);


function changeScale(direction){
  if (direction == '+') {
    transformScale *= 2;
  } else {
    transformScale /= 2;
  }
  canvas.style ="transform: scale("+transformScale+");"
}

