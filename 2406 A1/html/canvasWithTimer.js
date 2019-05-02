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

let timer //use for animation motion

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

let notesColor = 'green' //color of the notes
let transposeLevels = 1 //how far from the original level.

let context = canvas.getContext('2d') // make the canvas

function getWordAtLocation(aCanvasX, aCanvasY) { // needed for assignment 1

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  for (let i = 0; i < words.length; i++) {
    wordsWidth = context.measureText(words[i].word).width
    if (Math.abs(words[i].x - aCanvasX) < wordsWidth  &&
      Math.abs(words[i].y - aCanvasY) < 20) return words[i]
  }
  return null
  
} // needed for assignment 1

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
} // needed for assignment 1 and edded


function handleMouseDown(e) {// needed for assignment 1

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
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

function handleMouseMove(e) { // needed for assignment 1
  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
} // needed for assignment 1

function handleMouseUp(e) { // needed for assignment 1

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
} // needed for assignment 1

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
      
    let userRequestObj = {
      text: userText
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
          for (let counter = 0; counter < responseObj.length; counter++) {
            textDiv.innerHTML = textDiv.innerHTML + `${responseObj[counter]}<br /><br />`
          }
          textDiv.innerHTML = textDiv.innerHTML + `</p>`
      }
      // set the varibles for placeing the lirics in the canvas
      transposeLevels = 0
      notesColor = "green"
      let yPositionPlacer = 50 
      let xPositionPlacer = 50
      let nubOfWordsInLyrics = 0 // counter to count how many words in the lircs 
      //replace word array with new words if there are any
      for (let counter = 0; counter < responseObj.length; counter++) { // going though each line
          let responseLine = responseObj[counter].split(" ") // split the lines into words.
          for (let counter2 = 0; counter2 < responseLine.length; counter2++) { // going though each word in a line
            let responseChar = responseLine[counter2].split("")  // split the words into charatures
            // set the varibles to store each word
            let word = ""
            let isInBracket = false
            for (let counter3 = 0; counter3 < responseChar.length; counter3++) { // going though each charature in each word 
                // seperate the words from the notes
                if (responseChar[counter3] == '[') { //go to note mode and add the word to the word list
                    isInBracket = true 
                    xPositionPlacer = putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, "word")
                    word = "" 
                    nubOfWordsInLyrics++
                }
                word += responseChar[counter3] // add a charature to the new word
                if (responseChar[counter3] == ']') { // go to word word and add the note to the note list
                    isInBracket = false
                    xPositionPlacer = putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, "note")
                    word = ""
                    nubOfWordsInLyrics++
                } 
                if (counter3 == responseChar.length-1) { // add the last word either if it a note or a word
                    if (isInBracket) {
                        xPositionPlacer = putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, "note")
                    } else {
                        xPositionPlacer = putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, "word")
                    }
                }
            }
          }
          // update the cordinates for placeing the words in the array
          yPositionPlacer += 50
          xPositionPlacer = 50;
      }
    })
  }
}

function putWordsOnCanvas(words, word, xPositionPlacer, yPositionPlacer, type) {
    // this function helps to put a word in the array and update the x cordinate
    words.push({word: word, x: xPositionPlacer, y: yPositionPlacer, type: type})
    context.fillText(word, xPositionPlacer, yPositionPlacer)
    context.strokeText(word, xPositionPlacer, yPositionPlacer)
    wordsWidth = context.measureText(word).width  
    xPositionPlacer += wordsWidth + 20
    // return the updated x position 
    return xPositionPlacer
    
}

function transposeUpButton() {
    // this function occures when the user press the Transpose Up button and increase the transpose
    // go though each word in the array
    for (let counter = 0; counter < words.length; counter++) {
        charWord = words[counter].word.split("") // split the word into charatures
        if (charWord[0] == '[') { // if it reach a note
            let newWord = ''        
            let charLength = charWord.length
            // go though each charature in the word
            for (let counter2 = 0; counter2 < charLength; counter2++) {
                if ((charWord[counter2] == 'A') && (charWord[counter2+1] != '#')) { // if it ia a A change it to A#
                    newWord += 'A#'
                } else if ((charWord[counter2] == 'A') && (charWord[counter2+1] == '#')) { // if it ia a A# change it to B
                    newWord += 'B'
                } else if ((charWord[counter2] == 'B') && (charWord[counter2+1] != '#')) { // if it ia a B change it to C
                    newWord += 'C'
                } else if ((charWord[counter2] == 'C') && (charWord[counter2+1] != '#')) { // if it ia a C change it to C#
                    newWord += 'C#'
                } else if ((charWord[counter2] == 'C') && (charWord[counter2+1] == '#')) { // if it ia a C# change it to D
                    newWord += 'D'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] != '#')) { // if it ia a D change it to D#
                    newWord += 'D#'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] == '#')) { // if it ia a D# change it to E
                    newWord += 'E'
                } else if ((charWord[counter2] == 'E') && (charWord[counter2+1] != '#')) { // if it ia a E change it to F
                    newWord += 'F'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] != '#')) { // if it ia a F change it to F#
                    newWord += 'F#'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] == '#')) { // if it ia a F# change it to G
                    newWord += 'G'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] != '#')) { // if it ia a G change it to G#
                    newWord += 'G#'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] == '#')) { // if it ia a G# change it to A
                    newWord += 'A'
                }  else if (charWord[counter2] != '#') { // add the same charature in the new note
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
        charWord = words[counter].word.split("") // split the word into charatures
        if (charWord[0] == '[') { // if it reach a note
            let newWord = ''
            let charLength = charWord.length
             // go though each charature in the word
            for (let counter2 = 0; counter2 < charLength; counter2++) {
                if ((charWord[counter2] == 'A') && (charWord[counter2+1] != '#')) { // if it ia a A change it to G#
                    newWord += 'G#'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] == '#')) { // if it ia a G# change it to G
                    newWord += 'G'
                } else if ((charWord[counter2] == 'G') && (charWord[counter2+1] != '#')) { // if it ia a G change it to F#
                    newWord += 'F#'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] == '#')) { // if it ia a F# change it to F
                    newWord += 'F'
                } else if ((charWord[counter2] == 'F') && (charWord[counter2+1] != '#')) { // if it ia a F change it to E
                    newWord += 'E'
                } else if ((charWord[counter2] == 'E') && (charWord[counter2+1] != '#')) { // if it ia a E change it to D#
                    newWord += 'D#'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] == '#')) { // if it ia a D# change it to D
                    newWord += 'D'
                } else if ((charWord[counter2] == 'D') && (charWord[counter2+1] != '#')) { // if it ia a D change it to C#
                    newWord += 'C#'
                } else if ((charWord[counter2] == 'C') && (charWord[counter2+1] == '#')) { // if it ia a C# change it to C
                    newWord += 'C'
                } else if ((charWord[counter2] == 'C') && (charWord[counter2+1] != '#')) { // if it ia a C change it to B#
                    newWord += 'B'
                } else if ((charWord[counter2] == 'B') && (charWord[counter2+1] != '#')) { // if it ia a B# change it to B
                    newWord += 'A#'
                } else if ((charWord[counter2] == 'A') && (charWord[counter2+1] == '#')) { // if it ia a B change it to A#
                    newWord += 'A'
                } else if (charWord[counter2] != '#') { // add the same charature in the new note
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

$(document).ready(function() {
  //This is called after the broswer has loaded the web page
      
  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)
  $(document).keyup(handleKeyUp)
  
  timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop
  
  
  drawCanvas()
})