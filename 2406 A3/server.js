/*
COMP 2406 Collision Demo
(c) Louis D. Nel 2018

This example is based on the collision geometry math presented in
assignment #3 (fall 2018).
Some of the variable names (e.g. angle_d) correspond to those
presented in the powerpoint slides with the assignment.

This code is intended to serve as the base code for building
an online multi-player game where clients are kept in synch
through a server -presumably using the socket.io npm module.


Use browser to view pages at http://localhost:3000/collisions.html
*/

//Server Code
const app = require("http").createServer(handler) //need to http
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs") //needed if you want to read and write files
const url = require("url") //to parse url strings
const PORT = process.env.PORT || 3000 //useful if you want to specify port through environment variable

const ROOT_DIR = "html" //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript", //should really be application/javascript
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

let haveHome = false
let haveVisitor = false
let haveSpectator = false
let turn = "red"

// keep track of the stones
let allStones //set of all stones. sorted by lying score
let homeStones //set of home stones in no particular order
let visitorStones //set of visitor stones in no particular order
let shootingQueue //queue of stones still to be shot

function get_mime(filename) {
  //Get MIME type based on extension of requested file name
  //e.g. index.html --> text/html
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}

app.listen(PORT) //start server listening on PORT

function handler(request, response) {
    let urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    let receivedData = ""

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk
    })

    //event handler for the end of the message
    request.on("end", function() {
      //Handle the client POST requests
      //console.log('received data: ', receivedData)

      //If it is a POST request then we will check the data.
      if (request.method == "GET") {
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html"

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          response.writeHead(200, {
            "Content-Type": get_mime(filePath)
          })
          response.end(data)
        })
      }
    })
  }

io.on('connection', function(socket){
  console.log("hello connection")
  
  socket.on('init', function(data) {
    console.log("here is a new player")
    if (haveHome) {
        //io.emit("handleJoinAsHomeButton", data)
    }
    if (haveVisitor) {
        //io.emit("handleJoinAsVistorButton", data)
    }
    if (haveSpectator) {
        //io.emit("handleJoinAsSpectatorButton", data)
    }
    
    console.log(turn)
    io.emit("changeColor", JSON.stringify({whosTurnIsIt:turn}))
    socket.broadcast.emit('newPlayerJoined'); // Tell players that a new player had joined to get data
  })
  
  socket.on("changeColor", function(data) {
      dataObject = JSON.parse(data)
      
      turn = dataObject.whosTurnIsIt
      console.log(turn)
      io.emit("changeColor", JSON.stringify({whosTurnIsIt:turn})) //broadcast to everyone including sender
  })
  
  socket.on("handleJoinAsHomeButton", function(data){
    console.log("got the Home button")
    haveHome = true
    //to broadcast message to everyone including sender:
    io.emit("handleJoinAsHomeButton", data) //broadcast to everyone including sender
  })
  
  socket.on("handleJoinAsVistorButton", function(data) {
    console.log("got the Visitor button")
    haveVisitor = true
    //to broadcast message to everyone including sender:
    io.emit("handleJoinAsVistorButton", data) //broadcast to everyone including sender
  })
  
  socket.on("handleJoinAsSpectatorButton", function(data) {
    console.log("got the Spectator button")
    haveSpectator = true
    //to broadcast message to everyone including sender:
    io.emit("handleJoinAsSpectatorButton", data) //broadcast to everyone including sender
  })
  
  socket.on("targeting", function(data) {
      console.log("someone targeting")
      //to broadcast message to everyone including sender:
      io.emit("targeting", data)
  })
  
  socket.on("moving target", function(data){
      io.emit("moving target", data)
  })
  
  socket.on("launch target", function(data) {
      console.log("target launch")
      //to broadcast message to everyone including sender:
      io.emit("launch target", data)
  })
  
  socket.on("advance", function(data) {
      //to broadcast message to everyone including sender:
      io.emit("advance", data)
  })
  
  socket.on("updateStone", function(data) {
    //to broadcast message to everyone including sender:
    io.emit("updateStone", data)
  })
})

console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test: open several browsers at:")
console.log("http://localhost:3000/assignment3.html")
