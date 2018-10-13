const remote = require('electron').remote;
var robot = remote.require("robotjs");
class PointRecord {
    constructor(name, error) {
        this.name = name;
        this.error = error;
        this.timer = null;
        this.hex;
        this.colorObject = {
            points:[]
        };
        this.startCoords = {};

        this.startWorker();
        this.subscriptions = {onchange:[]};
    }

    onchange(func){
      this.subscriptions.onchange.push(func)
    } 

    emitChange(){
      this.subscriptions.onchange.forEach(x=> x())
    }

    setNewPoint(x,y, color) {
      if (Object.keys(this.startCoords).length == 0) {
        this.startCoords = {x:x, y:y}
        this.colorObject.points.push({
          error:this.error,
          coords:{x:0,y:0},
          color:this.convertToRGB(color)
        })
      }else{
        let diff = {x:(x - this.startCoords.x), y:(y - this.startCoords.y)}
        console.log(diff)
        this.colorObject.points.push({
          error:this.error,
          coords:diff,
          color:this.convertToRGB(color)
        })
      }
      this.emitChange();
    }

    convertToRGB(colorHash){
      console.log(colorHash)
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHash);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    startWorker() {
        this.timer = setInterval(() => {
            var mouse = robot.getMousePos();
            this.hex = robot.getPixelColor(mouse.x, mouse.y);
            // $("#color").text(this.hex);
            // $("body").css("background-color", "#" + this.hex);
        }, 200);
    }
}

module.exports = PointRecord;