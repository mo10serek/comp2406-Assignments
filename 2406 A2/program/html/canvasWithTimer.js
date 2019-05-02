/*
COMP 2406 (c) L.D. Nel 2018

Javascript to handle mouse dragging and release
to drag a string around the html canvas.
Keyboard arrow keys are used to move a moving box around.

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM elements are the canvas on which
where are drawing and a text field and button where the user can type data.

This example shows examples of using JQuery.
JQuery is a popular helper library that has useful methods,
especially for sendings asynchronous (AJAX) requests to the server
and catching the responses.

See the W3 Schools website to learn basic JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data
*/

//Use javascript array of objects to represent words and their locations
let words = []

let lyricDisplay = ""

let timer //use for animation motion

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

//let document = ""

let notesColor = 'green' //color of the notes
let transposeLevels = 1 //how far from the original level.

let context = canvas.getContext('2d') // make the canvas

function getWordAtLocation(aCanvasX, aCanvasY) { // needed for assignment 2

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
    
  //console.log("////////////////////////")
  
  for (let i = 0; i < words.length; i++) {
    wordsWidth = context.measureText(words[i].word).width
    wordsHeight = context.measureText(words[i].word).height
    endX = words[i].x + wordsWidth
    endY = words[i].y + 20
    console.log(words[i].word)
    console.log("x: " + words[i].x + " < " + aCanvasX + " < " + endX)
    console.log("y: " + words[i].y + " < " + aCanvasY + " < " + endY)
    if (Math.abs(words[i].x - aCanvasX) < wordsWidth  &&
      Math.abs(words[i].y - aCanvasY) < 20) {
        return words[i]
    }
  }
  console.log("x:" + aCanvasX)
  console.log("y:" + aCanvasY)
  return null
  
} // needed for assignment 2

function drawCanvas() {
  // this function will draw the canvas in the client
    
  // set up the canvas
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  // set up the font
  context.font = '20pt Arial'
  context.fillStyle = 'blue'
  context.strokeStyle = 'blue'

  // put the words in the canvas
  for (let i = 0; i < words.length; i++) {
    let data = words[i]
    if (data.type == "note") {
        context.fillStyle = notesColor
        context.strokeStyle = notesColor
    } else {
        context.fillStyle = 'blue'
        context.strokeStyle = 'blue'
    }
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)
  }
  context.stroke()
} // needed for assignment 2 and edded


function handleMouseDown(e) {// needed for assignment 2

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //canvas.width = 800
  //canvas.height = 600
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  console.log(e.pageX)
  console.log(rect.left)
  let canvasY = e.pageY - rect.top
  console.log(e.pageY)
  console.log(rect.top)
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
} // needed for assignment 1

function handleMouseMove(e) { // needed for assignment 2
  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
} // needed for assignment 1

function handleMouseUp(e) {

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
} // needed for assignment 2

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
function handleKeyUp(e) { 
    if (e.which == ENTER) {
        handleSubmitButton() //treat ENTER key like you would a submit
        //$('#userTextField').val('') //clear the user text field
    }
}

function handleTimer() { // needed for assignment 1 and edded
  drawCanvas()
} // needed for assignment 1 and edded

function handleSubmitButton() {
    // this function is use to put the JASO object to the clent, and put the lirics to the canvas and add to the word array
  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    // put all information in the object
    let userRequestObj = {
      text: userText,
      sheet: document,
      type: "get song"
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field

     words = []
    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      var data = JSON.parse(data) // convert the JSON object to a normal object
      let responseObj = data.text.split("\n") // split the object to seprate lines
      // put the whole lirics in web browser
      let textDiv = document.getElementById("text-area")
      textDiv.innerHTML = "";
      transposeLevels = 0
      if (data == "") {
          textDiv.innerHTML = textDiv.innerHTML + `<p></p>`
      } else {
          textDiv.innerHTML = textDiv.innerHTML + `<p>`
          lyricDisplay = ''
          for (let counter = 0; counter < responseObj.length; counter++) {
            textDiv.innerHTML = textDiv.innerHTML + `${responseObj[counter]}<br /><br />`
            lyricDisplay += responseObj[counter]
            lyricDisplay += '\n'
          }
          textDiv.innerHTML = textDiv.innerHTML + `</p>`
      }
      // set the varibles for placeing the lirics in the canvas
      transposeLevels = 0
      notesColor = "green"
      let yPositionPlacer = 80 
      let xPositionPlacerLyric = 80
      let xPositionPlacerChord = 0
      
      // make new words to put in the canvas
      let chords = ''
      let lyrics = ''
      
      // varibles to arrange the words with the chord
      let isInBracket = false
      let removeSpaceInLyrics = 0

      //replace word array with new words if there are any
      for (let counter = 0; counter < responseObj.length; counter++) { // going though each line
        let responseChar = responseObj[counter].split("") // split the lines into words.
        /////////////////////////////////////////////
        // for of loop to go though each char 
        for (let char of responseChar) {
            if (char == '[') { // go to note mode
                isInBracket = true
                removeSpaceInLyrics++
                xPositionPlacerChord = xPositionPlacerLyric
            } else if (char == ']') { // go to char mode
                isInBracket = false
                xPositionPlacerChord += context.measureText(lyrics).width
                putWordsOnCanvas(words, chords, xPositionPlacerChord, yPositionPlacer, "note")
            } else if (isInBracket == false) { // add char if it in char mode
                if (char == ' ') {
                    if (removeSpaceInLyrics == 0) {
                        xPositionPlacerLyric = putWordsOnCanvas(words, lyrics, xPositionPlacerLyric, yPositionPlacer, "word")
                        lyrics = ''
                    } else {
                        removeSpaceInLyrics--
                    }
                    chords = ''
                } else {
                    lyrics += char
                    removeSpaceInLyrics=0
                    chords = ''
                }
            } else { // add char if it in note                     
                chords += char
            }
        }
        xPositionPlacerChord = ""
        // end loop
        /////////////////////////////////////////////
        // update the cordinates for placeing the words in the array
        
        if (isInBracket) {
            // store the note in the canvas and update the xPositionPlacerLyric
            xPositionPlacerLyric = putWordsOnCanvas(words, lyrics, xPositionPlacerChord, yPositionPlacer, "note")
        } else {
            // store the word in the canvas and update the xPositionPlacerLyric
            xPositionPlacerLyric = putWordsOnCanvas(words, lyrics, xPositionPlacerLyric, yPositionPlacer, "word")
        }
        
        // reset the word and update the locations
        lyrics = ''
        yPositionPlacer += 80
        xPositionPlacerLyric = 50;
      }
    })
  }
}

function putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, type) {
    // this function helps to put a word in the array and update the x cordinate
    if (type == "word") {
        // put the word type in the canvas
        words.push({word: word, x: xPositionPlacer, y: yPositionPlacer, type: type})
        context.fillText(word, xPositionPlacer, yPositionPlacer)
        context.strokeText(word, xPositionPlacer, yPositionPlacer)
        
        // update the x position value
        wordsWidth = context.measureText(word).width  
        xPositionPlacer += wordsWidth + 20
        
        //return the updated x position 
        return xPositionPlacer
    } else {
        // set up the cordinates
        yPositionPlacer -= 24
        storeXPositionPlacer = 0
        
        // orginize the y position in the canvas
        for (let counter = words.length-1; counter > 0; counter--) {
            if (words[counter].type == "note") {
                if ((words[counter].x <= xPositionPlacer) && (xPositionPlacer <= words[counter].x + context.measureText(words[counter].word).width)) {
                    storeXPositionPlacer = xPositionPlacer
                    xPositionPlacer = words[counter].x + context.measureText(words[counter].word).width + context.measureText(" ").width 
                }
                break
            }
        }
        
        // put the note type in the canvas 
        words.push({word: word, x: xPositionPlacer, y: yPositionPlacer, type: type})
        context.fillText(word, xPositionPlacer, yPositionPlacer)
        context.strokeText(word, xPositionPlacer, yPositionPlacer)
        
        // update the cordinates
        wordsWidth = context.measureText(word).width
        xPositionPlacer += wordsWidth + 20
        
        //return the updated x position
        return xPositionPlacer
    }   
}

function transposeUpButton() {
    // this function occures when the user press the Transpose Up button and increase the transpose
    // go though each word in the array
    for (let counter = 0; counter < words.length; counter++) {
        if (words[counter].type == "note") {
            charWord = words[counter].word.split("") // split the word into charatures
            let newWord = ''
            let charLength = charWord.length
            // go though each charature in the word
            for (let counter2 = 0; counter2 < charLength; counter2++) {
                if ((charWord[counter2] == 'A') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a A change it to A#
                    newWord += 'A#'
                } else if ((charWord[counter2] == 'A') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a A# change it to B
                    newWord += 'B'
                } else if ((charWord[counter2] == 'B') && ((charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b'))) { // if it ia a B change it to C
                    newWord += 'C'
                } else if ((charWord[counter2] == 'C') && ((charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b'))) { // if it ia a C change it to C#
                    newWord += 'C#'
                } else if ((charWord[counter2] == 'C') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a C# change it to D
                    newWord += 'D'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a D change it to D#
                    newWord += 'D#'
                } else if ((charWord[counter2] == 'D') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a D# change it to E
                    newWord += 'E'
                } else if ((charWord[counter2] == 'E') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a E change it to F
                    newWord += 'F'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a F change it to F#
                    newWord += 'F#'
                } else if ((charWord[counter2] == 'F') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a F# change it to G
                    newWord += 'G'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a G change it to G#
                    newWord += 'G#'
                } else if ((charWord[counter2] == 'G') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a G# change it to A
                    newWord += 'A'
                }  else if ((charWord[counter2] != '#') && (charWord[counter2] != 'b')) { // add the same charature in the new note
                    newWord+= charWord[counter2]
                }
            }
            // replace the new word with the old one
            words[counter].word = ''
            words[counter].word = newWord
        }
    }
    // increase the level of transpose
    transposeLevels++
    console.log(transposeLevels)
    // function to change the color
    moveTransposeLevel()
    
}

function transposeDownButton() {
    // this function occures when the user press the Transpose Down button and decrease the transpose
    // go though each word in the array
   for (let counter = 0; counter < words.length; counter++) {
        if (words[counter].type == "note") {
            charWord = words[counter].word.split("") // split the word into charatures
            let newWord = ''
            let charLength = charWord.length
             // go though each charature in the word
            for (let counter2 = 0; counter2 < charLength; counter2++) {
                if ((charWord[counter2] == 'A') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a A change it to G#
                    newWord += 'G#'
                } else if ((charWord[counter2] == 'G') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a G# change it to G
                    newWord += 'G'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a G change it to F#
                    newWord += 'F#'
                } else if ((charWord[counter2] == 'F') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a F# change it to F
                    newWord += 'F'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a F change it to E
                    newWord += 'E'
                } else if ((charWord[counter2] == 'E') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')){ // if it ia a E change it to D#
                    newWord += 'D#'
                } else if ((charWord[counter2] == 'D') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a D# change it to D
                    newWord += 'D'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a D change it to C#
                    newWord += 'C#'
                } else if ((charWord[counter2] == 'C') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a C# change it to C
                    newWord += 'C'
                } else if ((charWord[counter2] == 'C') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a C change it to B#
                    newWord += 'B'
                } else if ((charWord[counter2] == 'B') && (charWord[counter2+1] != '#') && (charWord[counter2+1] != 'b')) { // if it ia a B# change it to B
                    newWord += 'A#'
                } else if ((charWord[counter2] == 'A') && ((charWord[counter2+1] == '#') || (charWord[counter2+1] == 'b'))) { // if it ia a B change it to A#
                    newWord += 'A'
                } else if ((charWord[counter2] != '#') && (charWord[counter2] != 'b')) { // add the same charature in the new note
                    newWord+= charWord[counter2]
                }
            }
            // replace the new word with the old one
            words[counter].word = ''
            words[counter].word = newWord
            
        }
    }
    // increase the level of transpose
    transposeLevels--
    console.log(transposeLevels)
    // function to change the color
    moveTransposeLevel()
    
}

function moveTransposeLevel() { 
    // this function change the color if the notes are back to the original notes
    if (transposeLevels == 13) { // this if else statement loops the transposeLevels
        transposeLevels = 1
    } else if (transposeLevels == -1) {
        transposeLevels = 11
    }
    // change the color to green if it back to the original notes
    if (transposeLevels %12 == 0){
        notesColor = 'green'
    } else { // chane the color to red if it increase or decrease
        notesColor = 'red'
    }
    
    drawCanvas()
}

function handleRefresh() {
    // set up all positions placers
    let yPositionPlacerLyric = 80 
    let yPositionPlacerChord = 56
    let xPositionPlacer = 80
    
    // make a new document
    let newDocument = ""
    
    // make arrays to store words and notes from the line
    let storeNotes = []
    let storeWords = []
    // keep reading the canvas until it reach the bottom
    while (yPositionPlacerLyric <= 800) {
        // go though the words array
        for (counter = 0; counter < words.length; counter++) {
            // first read the words in the line
            if ((words[counter].type == "word") && (yPositionPlacerLyric - 20 < words[counter].y) && (words[counter].y < yPositionPlacerLyric + 20)) {                
                storeWords.push({x: words[counter].x, y: words[counter].y ,word: words[counter].word})
            }
            // second read the notes in the line
            if ((words[counter].type == "note") && (yPositionPlacerChord - 20 < words[counter].y) && (words[counter].y < yPositionPlacerChord + 20)) {
                let newNote = "["
                newNote += words[counter].word
                newNote += "]"
                let wordWidth = context.measureText(words[counter]).width
                storeNotes.push({x: words[counter].x, width: wordsWidth, word: newNote})
            }
        }
        
        // both sort the words and notes by the positions of its x value
        storeWords.sort(function (a,b) {
            return a.x - b.x
        })
        
        storeNotes.sort(function (a,b) {
            return a.x - b.x
        })
        
        // start to merge the notes withe the words
        if (!(storeNotes.length == 0) || !(storeWords.length == 0)){
            let counter3 = 0 // for going though each word in the stored words
            for (counter = 0; counter < storeWords.length; counter++) { // go though the stored words
                // set up the varibles to store the words
                let wordX = storeWords[counter].x
                let chars = storeWords[counter].word.split('') 
                
                // make the new line for the document
                let newLine = ""
                
                // go though each char in a word
                for (counter2 = 0; counter2 < chars.length; counter2++) {
                    // check if the notes are not empty
                    if (storeNotes[counter3] != undefined) {
                        // add a char if it bettween the chosen word
                        if ((storeNotes[counter3].x <= wordX) && (wordX <= storeNotes[counter3].x + storeNotes[counter3].width)) {
                            newLine += storeNotes[counter3].word
                            counter3++
                        } 
                    }
                    // add the rest of the word
                    newLine += chars[counter2]
                    wordX += context.measureText(chars[counter2]).width
                }
                // add a space if at the end of the line
                if (!(counter == storeWords.length-1)) {
                    newLine += " "
                }
                // add the new line
                newDocument += newLine
            }
            // go the the next line
            newDocument += "\r\n"
        }
        // empty the stored words and notes and update the y positions 
        storeNotes = []
        storeWords = []
        yPositionPlacerLyric += 40
        yPositionPlacerChord += 40
    }
    
    // now start puting the document bellow the canvas
    let splitDocument = newDocument.split('\n') // split the document in lines
    let textDiv = document.getElementById("text-area") 
    textDiv.innerHTML = "";
    lyricDisplay = ''
    textDiv.innerHTML += `<p>`
    for (let counter = 0; counter < splitDocument.length; counter++) { // add each line to the document
        textDiv.innerHTML = textDiv.innerHTML + `${splitDocument[counter]}<br /><br />`
        lyricDisplay += splitDocument[counter]
        lyricDisplay += "\n"
    }
    textDiv.innerHTML = textDiv.innerHTML + `</p>`
}

function handleSaveAs() {    
    let userText = $('#userTextField').val(); //get text from user text input field
    if (userText && userText != '') { 
        // store the object and sent it back to the server
        userRequestObj = {
            text: userText,
            sheet: lyricDisplay,
            type: "give song"
        } 
        $('#userTextField').val('') //clear the user text field
        let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
        $.post("userText", userRequestJSON, function(data, status) {})
    }
}

$(document).ready(function() {
  //This is called after the broswer has loaded the web page
      
  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)
  $(document).keyup(handleKeyUp)
  
  timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop

  drawCanvas()
})