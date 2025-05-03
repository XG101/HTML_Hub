document.addEventListener('DOMContentLoaded', () => {
    // ✅ Reload page if coming from a deleted recipe
    if (localStorage.getItem("reloadNeeded") === "true") {
        localStorage.removeItem("reloadNeeded");
        location.reload();
        return; // Prevent duplicate reload
    }

    const CARD_CONTAINER = document.querySelector('.card-container');
    const RECIPES_PER_PAGE = 9;
    let allRecipes = [];
    let filteredRecipes = [];
    let currentPage = 1;

    function truncateStory(story, maxLength = 160) {
        if (!story) return '';
        return story.length > maxLength ? story.substring(0, maxLength).trim() + '...' : story;
    }

    function createCard(recipe) {
        const card = document.createElement('div');
        card.className = 'card bg-light';
        const categories = [
            recipe.season,
            recipe.cuisine,
            recipe.difficulty,
            ...(recipe.dietary || []),
        ].join(',');

        card.classList.add('card');
        card.id = `card${recipe.id}`;
        card.setAttribute('categories', categories);

        const imageSrc = recipe.images[0]?.startsWith("data:")
            ? recipe.images[0]
            : "images/" + recipe.images[0];

        card.innerHTML = `
            <button class="btn clear favorite-btn" onclick="addToFavorites('card${recipe.id}')">
                <img id="favorButton${recipe.id}" src="images/star.svg" width="50" height="50" alt="Favorite Star" />
            </button>
            <img src="${imageSrc}" class="card-img-top img-fluid" alt="${recipe.name}" />
            <div class="card-body">
                <h5 class="card-title">${recipe.name}</h5>
                <p class="card-text">${truncateStory(recipe.story)}</p>
                <a href="genericFood.html?id=${recipe.id}" class="btn btn-primary">Go to Recipe</a>
            </div>
        `;

        if (recipe.userCreated) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = "btn btn-danger mt-2";
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
              deleteUserRecipe(recipe.id);
            };
            card.querySelector('.card-body').appendChild(deleteBtn);
          }

        return card;
    }

    function displayPage(page) {
        CARD_CONTAINER.innerHTML = '';
        const start = (page - 1) * RECIPES_PER_PAGE;
        const end = start + RECIPES_PER_PAGE;
        const currentRecipes = filteredRecipes.slice(start, end);
        currentRecipes.forEach(recipe => {
            const card = createCard(recipe);
            CARD_CONTAINER.appendChild(card);
        });
        renderPaginationControls();
        syncFavoritesUI();
    }

    function renderPaginationControls() {
        let totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
        let paginationDiv = document.getElementById('pagination-controls');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'pagination-controls';
            CARD_CONTAINER.after(paginationDiv);
        }
        paginationDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'} m-1`;
            btn.onclick = () => {
                currentPage = i;
                displayPage(currentPage);
            };
            paginationDiv.appendChild(btn);
        }
    }

    function deleteUserRecipe(recipeId) {
        // Remove from userRecipes
        const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
        const updated = userRecipes.filter(r => r.id !== recipeId);
        localStorage.setItem('userRecipes', JSON.stringify(updated));
    
        // Remove from favorites as well
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const newFavorites = favorites.filter(fav => fav.id !== `card${recipeId}`);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
        // Remove from in-memory recipes
        allRecipes = allRecipes.filter(r => r.id !== recipeId);
        filteredRecipes = filteredRecipes.filter(r => r.id !== recipeId);
    
        displayPage(currentPage);
    }

    Promise.all([
        fetch('recipe.json').then(res => res.json()),
        Promise.resolve(JSON.parse(localStorage.getItem('userRecipes')) || [])
    ])
    .then(([staticRecipes, userRecipes]) => {
        allRecipes = [...staticRecipes, ...userRecipes];
        filteredRecipes = allRecipes;
        displayPage(currentPage);

        window.allRecipes = allRecipes;
        window.filteredRecipes = filteredRecipes;
        window.setFilteredRecipes = (newList) => {
            filteredRecipes = newList;
            currentPage = 1;
            displayPage(currentPage);
        };

        if (typeof reinitializeFiltering === "function") {
            reinitializeFiltering();
        }
    })
    .catch(err => console.error('Failed to load recipes:', err));
});


function truncateStory(fullStory, maxLength = 160) {
    if (!fullStory) return '';
    return fullStory.length > maxLength 
        ? fullStory.slice(0, maxLength).trim() + '...'
        : fullStory;
}