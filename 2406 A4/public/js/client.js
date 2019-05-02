function getRecipes() {
    
    // get the recipes from the text field
    let recipesName = document.getElementById('recipes').value

    // if the text field is empty alert the user
    if(recipesName === '') {
        return alert('Enter Ingredient:')
    }

    // get the element to put the pictures
    let cityDiv = document.getElementById('ingredientrecipes')
    cityDiv.innerHTML = ''

    // start puting the recipes
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(recipesName)
            console.log(xhr.responseText)
            // get the data
            let response = JSON.parse(xhr.responseText)
            let left = 20
            let top = 70
            console.log(response.count)
            // loop though all the recipes and print them all out
            for (let counter = 0; counter < response.count; counter++) {
                console.log(recipesName)
                let name = counter + 1
                let className = "recipe" + name
                cityDiv.innerHTML = cityDiv.innerHTML + `
                <div id="recipesMine" class=${className} style="left:${left}px;top:${top}px;">
                    <a href=${response.recipes[counter].f2f_url} target="_blank">
                        <img src=${response.recipes[counter].image_url } height="280" width="400">
                    </a>
                    <h3 align="center">${response.recipes[counter].title}</h3>
                </div>`
                left += 440
                // go the the next line
                if (left > 900){
                    top += 420
                    left = 20
                }
            }
        }
    }
    // sent the get post
    xhr.open('GET', `/recipes?ingredient=${recipesName}`, true)
    xhr.send()
    
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("recipes")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
});


//This is called after the broswer has loaded the web page
let url = window.location.href
  
if (url.indexOf('ingredient') != -1) {
    qString = url.split("=")[1]
    console.log(qString)
    
    document.getElementById('recipes').value = qString
    getRecipes()
    
    console.log("here", url.indexOf('recipes'), url[url.indexOf('recipes')])
}
