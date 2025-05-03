function getCurrentSeason() {
  const month = new Date().getMonth(); // 0 = January
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

function createRecipeCard(recipe) {
  const a = document.createElement('a');
  a.className = 'btn btn-primary';
  a.href = `genericFood.html?id=${recipe.id}`;

  const card = document.createElement('div');
  card.className = 'card bg-light';
  card.setAttribute('categories', [
    recipe.season,
    recipe.cuisine,
    recipe.difficulty,
    ...(recipe.dietary || [])
  ].join(','));
  card.id = `card${recipe.id}`;

  card.innerHTML = `
  <img src="images/${recipe.images[0]}" class="card-img-top img-fluid" alt="${recipe.name}">
  <div class="card-body">
    <h5 class="card-title">${recipe.name}</h5>
    <p class="card-text">${truncateStory(recipe.story)}</p>
  </div>
  `;

  a.appendChild(card);
  return a;
}

function populateHomePage(recipes) {
  if (!recipes.length) return;

  const mainGrid = document.getElementById('main-card-grid');
  const seasonalContainer = document.getElementById('seasonal-container');
  const recipeOfDaySection = document.querySelector('#recipe-of-day');

  // Pick a random recipe
  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

  if (recipeOfDaySection) {
    recipeOfDaySection.innerHTML = `
      <a href="genericFood.html?id=${randomRecipe.id}" class="btn btn-primary">
        <div class="card bg-light mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-12 col-md-4">
              <img src="images/${randomRecipe.images[0]}" class="img-fluid rounded-start" alt="${randomRecipe.name}">
            </div>
            <div class="col-12 col-md-8">
              <div class="card-body">
                <h5 class="card-title">${randomRecipe.name}</h5>
                <p class="card-text">${truncateStory(randomRecipe.story)}</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  // Clear existing cards
  mainGrid.innerHTML = '';

  // Fill main grid
  recipes.forEach(recipe => {
    const cardElement = createRecipeCard(recipe);
    mainGrid.appendChild(cardElement);
  });

  // Fill seasonal section
  const season = getCurrentSeason();
  recipes.forEach(recipe => {
    const categories = [
      recipe.season,
      recipe.cuisine,
      recipe.difficulty,
      ...(recipe.dietary || [])
    ];

    if (categories.includes(season)) {
      const seasonalCard = createRecipeCard(recipe);
      seasonalContainer.appendChild(seasonalCard);
    }
  });
}

// Fetch recipes and run everything
window.addEventListener("DOMContentLoaded", () => {
  fetch('recipe.json')
    .then(response => response.json())
    .then(data => {
      populateHomePage(data);
    })
    .catch(error => console.error('Error loading recipe data:', error));
});


// Code for switching between light and dark mode
// uses local storage to save preferences
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkMode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkMode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkMode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkMode() : disableDarkMode()
})

//seizure mode
const seizureSwitch = document.getElementById('seizure')
let checkSeizure = false

const enableSeizureMode = () => {
  document.body.classList.add('seizuremode')
  localStorage.setItem('darkmode', 'active')
}
seizureSwitch.addEventListener("click", () => {
  if (checkSeizure == false){
    document.body.classList.add('seizuremode')
    checkSeizure = true;
  }
  else {
    document.body.classList.remove('seizuremode')
    checkSeizure = false;
  }
})

function truncateStory(fullStory, maxLength = 80) {
  if (!fullStory) return '';
  return fullStory.length > maxLength 
      ? fullStory.slice(0, maxLength).trim() + '...'
      : fullStory;
}