Student: Michael Balcerzak 101071699 michaelbalcerzak@cmail.carleton.ca 

version: 10.15.0 LTS OS: Windows 10 Cilent to test on: Microsoft Edge and Chrome

Install:
The only thing I install is package.json
npm install 
Version: 1.0.0

Launch:
To launch the program, you need to download the file to a documentary that the terminal or command prompt
can access. UnZip the file you are using. Then you need to go to terminal and type "cd" and then locate 
the file "2406 A4" in the terminal. "cd 2406 A4" and then "cd program" and before you type "node server.js" 
type npn install to install the express.js file and other files in dependencies in package.json file.
Then type "node server.js". The file. You will see this code,

Server listening on port: 3000
To Test:
http://localhost:3000
http://localhost:3000/recipes
http://localhost:3000/recipes?ingredient=Basil
http://localhost:3000/recipes?ingredient=Basil,Cumin

Testing:
copy "http://localhost:3000" from the terminal and paste it in the browser you most likely you are
using. You will see a text file and a submit button. Type Clove or Basil in the text file and
press the submit button. In a little while, you will see a list of food and its pictures what is base 
on what you type in. when you click on the pictures it will go to the link where the food is located.
When you type http://localhost:3000/recipes in the uml header, it will display 


 
Issues:
Don't run this program more than 50 times a day. It will not read the API key. 
Also I can't do the post for 
http://localhost:3000/recipes?ingredient=Basil
http://localhost:3000/recipes?ingredient=Basil,Cumin
because I am not able to sent the json data and render it. But I am able to display its json data.