/*
Client-side javascript for 2406 collision geometry demo
(c) Louis D. Nel 2018

This demonstration provides a client-side only application. In this
demonstration the server is used only to serve the application to the client.
Once the application is running on the client the server is no longer involved.

This demonstration is a simulation of collisions based on the game of curling.
Collision dynamics is based on simple geometry (not physics).
Collision events are modelled using a Collision object and these objects are
placed in a Collsion set. This approach is to provide "Debouncing" and to
handle the "Tunneling Problem" common in such simulations.

There are many refactoring opportunies in this code including the following:

1)The shooting area and closeup area share a global co-ordinate system.
It would be better if each has its own local co-ordinate system.

2)Most objects are represented through an ES6 Class. However the main level
canvasWithTimer.js code is not. It would be better for the main level code
to also be represented through a class.

3)The constants and state variables a still a bit scattered through the code
It would be better to centralize them a bit more to re-enforced the MVC
model-view-controller pattern.

4)The code does not take advantage of closures. In many cases parameters
are being passed around which might be made accessible through closures.

5) The code does not take advantage of any modularization features of ES6
nor does it take particular advantage of closures.
Instead the .html file simply includes a <script></script> statement for each
required file. No attempt is made to bundle the files.
*/

//leave this moving word for fun and for using it to
//provide status info to client.

// ==========================================================================================================
// ------------------------------------------------  set up  ------------------------------------------------
// ==========================================================================================================
let timer //timer for animating motion
let pollingTimer //timer to poll server for location updates
let canvas = document.getElementById('canvas1') //our drawing canvas
let iceSurface = new Ice(canvas)
let gameHaveStarted = false;
//connect to server and retain the socket
let socket = io('http://' + window.document.location.host)

allStones = new SetOfStones() //set of all stones. sorted by lying score
homeStones = new SetOfStones() //set of home stones in no particular order
visitorStones = new SetOfStones() //set of visitor stones in no particular order
shootingQueue = new Queue() //queue of stones still to be shot*/
let shootingArea = iceSurface.getShootingArea()
let stoneRadius = iceSurface.nominalStoneRadius()

//create stones
for(let i=0; i<STONES_PER_TEAM; i++){
  let homeStone = new Stone(0, 0, stoneRadius, HOME_COLOUR)
  let visitorStone = new Stone(0, 0, stoneRadius, VISITOR_COLOUR)
  homeStones.add(homeStone)
  visitorStones.add(visitorStone)
  allStones.add(homeStone)
  allStones.add(visitorStone)
}


function stageStones(){
  //stage the stones in the shooting area by lining them vertically on either side
  //add stones to the shooting order queue based on the value
  //of whosTurnIsIt state variable

  if(whosTurnIsIt === HOME_COLOUR){
    for(let i=0; i<STONES_PER_TEAM; i++){
      shootingQueue.enqueue(homeStones.elementAt(i))
      shootingQueue.enqueue(visitorStones.elementAt(i))
      homeStones.elementAt(i).setLocation({x:shootingArea.x + stoneRadius, y:shootingArea.height - (stoneRadius + (STONES_PER_TEAM-i-1)*stoneRadius*2)})
      visitorStones.elementAt(i).setLocation({x:shootingArea.x + shootingArea.width - stoneRadius, y:shootingArea.height - (stoneRadius + (STONES_PER_TEAM-i-1)*stoneRadius*2)})
    }
  }
  else {
    for(let i=0; i<STONES_PER_TEAM; i++){
      shootingQueue.enqueue(visitorStones.elementAt(i))
      shootingQueue.enqueue(homeStones.elementAt(i))
      homeStones.elementAt(i).setLocation({x:shootingArea.x + stoneRadius, y:shootingArea.height - (stoneRadius + (STONES_PER_TEAM-i-1)*stoneRadius*2)})
      visitorStones.elementAt(i).setLocation({x:shootingArea.x + shootingArea.width - stoneRadius, y:shootingArea.height - (stoneRadius + (STONES_PER_TEAM-i-1)*stoneRadius*2)})
    }

  }
}

stageStones()

//connect to server and retain the socket
let setOfCollisions = new SetOfCollisions()

let stoneBeingShot = null //Stone instance: stone being shot with mouse
let shootingCue = null //Cue instance: shooting cue used to shoot ball with mouse


let fontPointSize = 18 //point size for chord and lyric text
let editorFont = 'Courier New' //font for your editor -must be monospace font
// ==========================================================================================================
// ------------------------------------------------          ------------------------------------------------
// ==========================================================================================================


// ==========================================================================================================
// -------------------------------------- all fuctions to handle the game -----------------------------------
// ==========================================================================================================
function distance(fromPoint, toPoint) {
  //point1 and point2 assumed to be objects like {x:xValue, y:yValue}
  //return "as the crow flies" distance between fromPoint and toPoint
  return Math.sqrt(Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2))
}

function drawCanvas() {

  const context = canvas.getContext('2d')
 
  // put color
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  //draw playing surface
  iceSurface.draw(context, whosTurnIsIt)

  context.font = '' + fontPointSize + 'pt ' + editorFont
  context.strokeStyle = 'blue'
  context.fillStyle = 'red'
  
  //draw the stones
  allStones.draw(context, iceSurface)
  if (shootingCue != null) shootingCue.draw(context)

  //draw the score (as topmost feature).
  iceSurface.drawScore(context, score)
}

function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  /*
  This code took some trial and error. If someone wants to write a
  nice tutorial on how mouse-locations work that would be great.
  */
  let rect = canvas.getBoundingClientRect()

  // account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  // return the value
  return {
    x: canX,
    y: canY
  }
}

function handleMouseDown(e) {
  if(enableShooting === false) return //cannot shoot when stones are in motion
  if(!isClientFor(whosTurnIsIt)) return //only allow controlling client

  //store the values
  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.x
  let canvasY = canvasMouseLoc.y
  //console.log("mouse down:" + canvasX + ", " + canvasY)

  stoneBeingShot = allStones.stoneAtLocation(canvasX, canvasY)
  // sent to the socket
  sentingData = {  
      canvasMouseLoc: canvasMouseLoc,
      stoneBeingShot: stoneBeingShot,
      canvasX: canvasX,
      canvasY: canvasY,
  }
  jsonData = JSON.stringify(sentingData)
  socket.emit("targeting", jsonData)
  
  // on this client fuction
  if(stoneBeingShot === null){
      if(iceSurface.isInShootingCrosshairArea(sentingData.canvasMouseLoc)){
        if(shootingQueue.isEmpty()) stageStones()
        console.log(`shooting from crosshair`)
        stoneBeingShot = shootingQueue.front()
        stoneBeingShot.setLocation(sentingData.canvasMouseLoc)
        console.log(stoneBeingShot)
        //we clicked near the shooting crosshair
      }
    }

    if (stoneBeingShot != null) {
        // make fuction when this client's mouse moves or let go
        $("#canvas1").mousemove(handleMouseMove)
        $("#canvas1").mouseup(handleMouseUp)
    }
  
  // Stop propagation of the event and stop any default
  // browser action
  e.stopPropagation()
  e.preventDefault()
}

socket.on("targeting", function(data) {
    
    gotData = JSON.parse(data)
    
    stoneBeingShot = gotData.stoneBeingShot
    
    // on socket
    if(stoneBeingShot === null){
      if(iceSurface.isInShootingCrosshairArea(gotData.canvasMouseLoc)){
        if(shootingQueue.isEmpty()) stageStones()
        //console.log(`shooting from crosshair`)
        stoneBeingShot = shootingQueue.front()
        stoneBeingShot.setLocation(gotData.canvasMouseLoc)
        console.log(shootingQueue)
        //we clicked near the shooting crosshair
      }
    }
    
    // set point in the socket
    if (stoneBeingShot != null) {
        shootingCue = new Cue(gotData.canvasX, gotData.canvasY)
    }
    
    drawCanvas()
    
})

function handleMouseMove(e) {
    
  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.x
  let canvasY = canvasMouseLoc.y

  // sent to the socket
  sentingData = {
      canvasX: canvasX,
      canvasY: canvasY,
      shootingCue: shootingCue
  }
  jsonData = JSON.stringify(sentingData)
  socket.emit("moving target", jsonData)
  
  e.stopPropagation()

  drawCanvas()
}

socket.on("moving target", function(data) {
    gotData = JSON.parse(data)

    // on socket
    if (shootingCue != null) {
        shootingCue.setCueEnd(gotData.canvasX, gotData.canvasY)
    }
    
    drawCanvas()
})

function handleMouseUp(e) {
  
  e.stopPropagation()
  
  // sent to the socket
  sentingData = {    
      shootingCue: shootingCue,
      stoneBeingShot: stoneBeingShot,
      shootingQueue: shootingQueue,
      enableShooting: enableShooting
  }
  jsonData = JSON.stringify(sentingData)
  socket.emit("launch target", jsonData)
  
}

socket.on("launch target", function(data) {
  canvasObject = JSON.parse(data)
  
  // assign the old values to the sent values
  this.shootingCue = canvasObject.shootingCue
  this.stoneBeingShot = canvasObject.stoneBeingShot
  this.shootingQueue = canvasObject.shootingQueue
  this.enableShooting = canvasObject.enableShooting
  // on socket
  if (shootingCue != null) {
    let cueVelocity = shootingCue.getVelocity()
    if (stoneBeingShot != null) stoneBeingShot.addVelocity(cueVelocity)
    shootingCue = null
    shootingQueue.dequeue()
    enableShooting = false //disable shooting until shot stone stops
  }
  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas

})

function handleTimer() {
  //allStones.advance(iceSurface.getShootingArea())
  let areaObject = {area: iceSurface.getShootingArea()}    
  let jsonObject = JSON.stringify(areaObject)
  socket.emit("advance", jsonObject)
 
  for (let stone1 of allStones.getCollection()) {
    for (let stone2 of allStones.getCollection()) {
      //check for possible collisions 
      if ((stone1 !== stone2) && stone1.isTouching(stone2) && (stone1.isStoneMoving() || stone2.isStoneMoving()))
      setOfCollisions.addCollision(new Collision(stone1, stone2))
    }
  }

  setOfCollisions.removeOldCollisions()

  if(allStones.isAllStonesStopped()){
    if(!shootingQueue.isEmpty()) {
        socket.emit("changeColor",JSON.stringify({whosTurnIsIt:shootingQueue.front().getColour()}))
        
    }
    score = iceSurface.getCurrentScore(allStones)
    enableShooting = true
  }
                                         
  drawCanvas()
}

socket.on("advance", function(data){
    let areaObject = JSON.parse(data)
    let area = areaObject.area
    for (let stone of allStones.getCollection()) {
        
        stone.x += stone.velocityX
        stone.y += stone.velocityY
        //slow moving ball based on friction
        stone.velocityX *= Stone.FRICTION_FACTOR()
        stone.velocityY *= Stone.FRICTION_FACTOR()

        //keep moving string within area bounds
        if (stone.x + stone.radius > area.x + area.width) {stone.x = area.x + area.width -stone.radius; stone.stop()}
        if (stone.x - stone.radius < area.x) {stone.x = area.x + stone.radius; stone.stop()}
        if (stone.y + stone.radius> area.height) {stone.y = area.height - stone.radius; stone.stop()}
        if (stone.y - stone.radius < area.y) {stone.y = area.y + stone.radius; stone.stop()}


        //stop if both x and y velocity is sufficiently small.
        const TOLERENCE = 0.12
        if(Math.abs(stone.velocityX) < TOLERENCE && Math.abs(stone.velocityY) < TOLERENCE) {
            stone.velocityX = 0
            stone.velocityY = 0
            stone.isMoving = false
        } else
            stone.isMoving = true
        }
    drawCanvas()
  })
  
socket.on("changeColor", function(data) {
    whosTurnIsIt = JSON.parse(data).whosTurnIsIt
})

// ==========================================================================================================
// ------------------------------------------------          ------------------------------------------------
// ==========================================================================================================
  
//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

function handleKeyDown(e) {
  //console.log("keydown code = " + e.which );
  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }
}

function handleKeyUp(e) {
  //console.log("key UP: " + e.which);
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    //do nothing for now
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}

// =========================================================================================================
// ------------------------------------------------ buttons ------------------------------------------------
// ========================================================================================================= 
function handleJoinAsHomeButton(){
  // asign this client to player
  if(!isHomePlayerAssigned){
    isHomePlayerAssigned = true
    isHomeClient = true
  }
  
  // sent to server
  socket.emit("handleJoinAsHomeButton")
}

socket.on("handleJoinAsHomeButton", function(data) {
  // on socket
  let btn = document.getElementById("JoinAsHomeButton")
  btn.disabled = true //disable button
  btn.style.backgroundColor="lightgray"
})

function handleJoinAsVisitorButton(){
  // asign this client to visitor
  if(!isVisitorPlayerAssigned) {
    isVisitorPlayerAssigned = true
    isVisitorClient = true
  }
  
  // sent to server
  socket.emit("handleJoinAsVistorButton")
}

socket.on("handleJoinAsVistorButton", function(data) {
  // on socket
  let btn = document.getElementById("JoinAsVisitorButton")
  btn.disabled = true //disable button
  btn.style.backgroundColor="lightgray"
})

function handleJoinAsSpectatorButton(){
  // asign this client to spectator 
  if(!isSpectatorClient) isSpectatorClient = true  

  // sent to server
  socket.emit("handleJoinAsSpectatorButton")
}

socket.on("handleJoinAsSpectatorButton", function(data) {
  // on socket
  let btn = document.getElementById("JoinAsSpectatorButton")
  btn.disabled = true //disable button
  btn.style.backgroundColor="lightgray"
})
// ==========================================================================================================
// ------------------------------------------------          ------------------------------------------------
// ==========================================================================================================

// ==========================================================================================================
// ------------------------------------------------ document ------------------------------------------------
// ==========================================================================================================
$(document).ready(function() {
  //This is called after the browswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)
  //console.log(allStones)
  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)
  timer = setInterval(handleTimer, 5) //animation timer
  //clearTimeout(timer); //to stop timer
  
  if (!gameHaveStarted) {
    gameHaveStarted = true
    socket.emit("init")  
  }
  
  btn = document.getElementById("JoinAsHomeButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor = HOME_PROMPT_COLOUR
  btn = document.getElementById("JoinAsVisitorButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor= VISITOR_PROMPT_COLOUR
  btn = document.getElementById("JoinAsSpectatorButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor= SPECTATOR_PROMPT_COLOUR

  drawCanvas()
})

socket.on("newPlayerJoined", function(data) {
    
    let stones = {
        allStones: allStones, 
        homeStones: homeStones,
        visitorStones: visitorStones,
        shootingQueue: shootingQueue
    }
    //console.log(stones.allStones)
    let jsonStones = JSON.stringify(stones)
    //console.log(JSON.parse(jsonStones).allStones)
    sentStoneToNewPlayer(jsonStones)
    
})

function sentStoneToNewPlayer(jsonStones) {
    socket.emit("updateStone",jsonStones)
}

socket.on("updateStone", function(data) {
    let stones = JSON.parse(data)
    let collection = stones.allStones.collection
    
    for (counter = 0; counter < collection.length; counter++) {
       allStones.collection[counter].x = collection[counter].x
       allStones.collection[counter].y = collection[counter].y
    }
     
    collection = stones.shootingQueue.collection
    let counter2 = 0
    let newQueue = new Queue()
    //console.log(shootingQueue)
    for (let counter of collection) {
       let newStone = new Stone(counter.x, counter.y, counter.radius, counter.color)
       newQueue.enqueue(newStone)
    }
    //shootingQueue = newQueue

})
// ==========================================================================================================
// ------------------------------------------------          ------------------------------------------------
// ==========================================================================================================