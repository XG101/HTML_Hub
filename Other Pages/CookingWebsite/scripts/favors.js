// This function is used to display the filtered cards on the favorites page
function filterFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const selectedCategories = new Set();

    document.querySelectorAll('.category-filter:checked').forEach(filter => {
        selectedCategories.add(filter.value);
    });

    favorites.forEach(favorite => {
        const cardCategories = favorite.categories ? favorite.categories.split(',') : [];
        const matchesCategory = selectedCategories.size === 0 || cardCategories.some(category => selectedCategories.has(category.trim()));

        const cardElement = document.getElementById(favorite.id);
        if (!cardElement) return;

        if (matchesCategory) {
            cardElement.style.display = '';
        } else {
            cardElement.style.display = 'none';
        }
    });
}

// Load favorites from localStorage and render
function showFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(favorite => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.classList.add('bg-light');
        cardDiv.id = favorite.id;

        cardDiv.innerHTML = `
            <img src="${favorite.image}" class="card-img-top" alt="${favorite.title}">
            <div class="card-body">
                <h5 class="card-title">${favorite.title}</h5>
                <p class="card-text">${truncateStory(favorite.story)}</p>
                <a href="${favorite.link}" class="btn btn-primary">Go to Recipe</a>
                <button class="btn clear favorite-btn" onclick="removeFromFavorites('${favorite.id}')">
                <img id="favorButton" src="images/smiley_star.svg" width="50" height="50" alt="Favorite Star" />
                </button>
            </div>
        `;

        cardDiv.setAttribute('categories', favorite.categories);
        favoritesContainer.appendChild(cardDiv);
    });

    filterFavorites();
}

// Remove card from favorites
function removeFromFavorites(cardId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites = favorites.filter(fav => fav.id !== cardId);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
    syncFavoritesUI();
}

function syncFavoritesUI() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    document.querySelectorAll('.card').forEach(card => {
        const cardId = card.id;
        const starBtn = card.querySelector(`#favorButton${cardId.replace('card', '')}`);
        const isFavorited = favorites.some(fav => fav.id === cardId);
        if (starBtn) {
            starBtn.src = isFavorited ? "images/smiley_star.svg" : "images/star.svg";
        }
    });
}

// Adds or removes a card from favorites
function addToFavorites(cardId) {
    const card = document.getElementById(cardId);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === cardId);
    const starBtn = card.querySelector(`#favorButton${cardId.replace('card', '')}`);

    if (existingIndex === -1) {
        // Add to favorites
        const title = card.querySelector('.card-title')?.innerText || '';
        const image = card.querySelector('.card-img-top')?.src || '';
        const link = card.querySelector('a')?.href || '#';
        const categories = card.getAttribute('categories') || '';
        favorites.push({ id: cardId, title, image, link, categories, favorited: true });
        if (starBtn) starBtn.src = "images/smiley_star.svg";
    } else {
        // Toggle off
        favorites.splice(existingIndex, 1);
        if (starBtn) starBtn.src = "images/star.svg";
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initial sync on load
window.onload = () => {
    syncFavoritesUI();
};

// Refilter on checkbox change
document.querySelectorAll('.category-filter').forEach(filter => {
    filter.addEventListener('change', function () {
        filterFavorites();
    });
});

// Initialize favorites and stars on page load
window.onload = function () {
    if (document.getElementById('favorites-container')) {
        showFavorites();
    }
    syncFavoritesUI();
};

function truncateStory(fullStory, maxLength = 160) {
    if (!fullStory) return '';
    return fullStory.length > maxLength 
        ? fullStory.slice(0, maxLength).trim() + '...'
        : fullStory;
}