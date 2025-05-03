let ingreCount = 1;
let direcCount = 1;

function addIngre(){
    if (ingreCount < 15){
        document.getElementById("ingreBox").insertAdjacentHTML("beforeend", "<input type='text' id='ingredients' name='ingredients'>");
        ingreCount += 1;
    }
}

function addDirec(){
    if (direcCount < 15){
        document.getElementById("direcBox").insertAdjacentHTML(
            "beforeend", 
            "<input type='text' name='directions'><br>"
        );
        direcCount += 1;
    }
}

function saveRecipe() {
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("box").value.trim();

    const ingredients = Array.from(document.getElementsByName("ingredients"))
        .map(input => input.value.trim())
        .filter(val => val !== "");

    const steps = Array.from(document.getElementsByName("directions"))
        .map(input => input.value.trim())
        .filter(val => val !== "");

    if (!name || !description || ingredients.length === 0 || steps.length === 0) {
        alert("Please fill out all required fields (Name, Description, Ingredients, Steps).");
        return;
    }

    const dietary = Array.from(document.querySelectorAll('input[type="checkbox"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.nextSibling.textContent.trim());

    const season = document.getElementById("c").value;
    const cuisine = document.getElementById("C").value;
    const prep_time = document.getElementById("time").value + " min";
    const difficulty = document.getElementById("D").value;

    const files = Array.from(document.getElementById("images").files);
    const imagePromises = files.map(fileToBase64);

    Promise.all(imagePromises).then(base64Images => {
        const newRecipe = {
            id: Date.now(),
            name,
            story: description,
            ingredients,
            steps,
            dietary,
            season,
            cuisine,
            prep_time,
            difficulty,
            images: base64Images,
            userCreated: true
        };

        const savedRecipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
        savedRecipes.push(newRecipe);
        localStorage.setItem('userRecipes', JSON.stringify(savedRecipes));

        alert("🎉 Recipe saved successfully!");
        location.reload();
    });
}

// Optional: Delete function (used by main display page)
function deleteUserRecipe(recipeId) {
    const savedRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    const updated = savedRecipes.filter(r => r.id !== recipeId);
    localStorage.setItem("userRecipes", JSON.stringify(updated));
    location.reload();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}