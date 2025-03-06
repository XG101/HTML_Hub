document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  let query = urlParams.get('query'); // Get the initial query from the URL, if any
  const categoryFilters = document.querySelectorAll('.category-filter'); // Get all category filters
  const cards = document.querySelectorAll('.card'); // Get all cards
  const searchInput = document.getElementById('search-input'); // Assuming there's a search input element

  // Function to filter cards based on the search query
  function filterCards(query) {
    const queryLower = query ? query.toLowerCase() : ''; // Make the query case-insensitive

    cards.forEach(card => {
      const recipeName = card.querySelector('h5').textContent.toLowerCase(); // Get the recipe name from the <h5> tag

      // Show or hide the card based on whether the recipe name matches the query
      if (recipeName.includes(queryLower)) {
        card.classList.add('query-match');
      } else {
        card.classList.remove('query-match');
      }
    });
  }

  // Function to filter cards by selected category
  function filterByCategory() {
    const selectedCategory = Array.from(categoryFilters).filter(filter => filter.checked).map(filter => filter.value)[0];

    cards.forEach(card => {
      const cardCategories = card.getAttribute('categories') ? card.getAttribute('categories').split(',').map(cat => cat.trim()) : [];
      const matchesCategory = !selectedCategory || cardCategories.includes(selectedCategory);

      // Show card if it matches the query and category
      if (card.classList.contains('query-match') && matchesCategory) {
        card.style.display = '';  // Show the card
      } else {
        card.style.display = 'none';  // Hide the card
      }
    });
  }

  // Apply the search query filter when the page loads
  if (query) {
    filterCards(query);
  }

  // Optional: Handle manual search input and update the URL
  if (searchInput) {
    searchInput.value = query || ''; // Set the search input value from the URL query
    searchInput.addEventListener('input', function () {
      query = searchInput.value.trim(); // Get the input value
      const url = new URL(window.location);
      url.searchParams.set('query', query); // Update the query parameter in the URL
      window.history.pushState({}, '', url); // Update the browser's URL without reloading
      filterCards(query); // Filter the cards based on the new query
      filterByCategory(); // Reapply category filters after query change
    });
  }

  // Apply the category filter and re-apply when a category filter is changed
  categoryFilters.forEach(filter => {
    filter.addEventListener('change', filterByCategory);
  });

  // Initially apply category filters on page load
  filterByCategory();

  // Update the 'Recipes' link dynamically to include the current query
  const recipeLink = document.querySelector('.nav-link[href="Recipies.html"]');
  recipeLink.href = `Recipies.html?query=${encodeURIComponent(query || '')}`;
});