import { recipes } from './recipes.mjs';

const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('.search-form input');
const randomButton = document.querySelector('#randomButton'); // Random recipe button
const allButton = document.querySelector('#allButton');       // Show all button

// ----------------------------
// Create rating stars
// ----------------------------
function createRatingStars(rating) {
  const span = document.createElement('span');
  span.classList.add('rating');
  span.setAttribute('role', 'img');
  span.setAttribute('aria-label', `Rating: ${rating} out of 5 stars`);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.setAttribute('aria-hidden', 'true');
    if (i <= rating) {
      star.textContent = '⭐';
      star.classList.add('icon-star');
    } else {
      star.textContent = '☆';
      star.classList.add('icon-star-empty');
    }
    span.appendChild(star);
  }
  return span;
}

// ----------------------------
// Create recipe card
// ----------------------------
function createRecipeCard(recipe) {
  const article = document.createElement('article');
  article.classList.add('recipe');

  const img = document.createElement('img');
  img.src = `images/${recipe.image}`;
  img.alt = recipe.name;
  article.appendChild(img);

  const h2 = document.createElement('h2');
  h2.textContent = recipe.name;
  article.appendChild(h2);

  const rating = createRatingStars(recipe.rating);
  article.appendChild(rating);

  const desc = document.createElement('p');
  desc.classList.add('description');
  desc.textContent = recipe.description;
  article.appendChild(desc);

  // Add tags if present
  if (recipe.tags?.length) {
    const ul = document.createElement('ul');
    ul.classList.add('tags');
    recipe.tags.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      ul.appendChild(li);
    });
    article.appendChild(ul);
  }

  return article;
}

// ----------------------------
// Display a list of recipes
// ----------------------------
function displayRecipes(recipeList) {
  recipesContainer.innerHTML = '';
  recipeList.forEach(recipe => {
    recipesContainer.appendChild(createRecipeCard(recipe));
  });
}

// ----------------------------
// Show random recipe
// ----------------------------
function showRandomRecipe() {
  const randomIndex = Math.floor(Math.random() * recipes.length);
  displayRecipes([recipes[randomIndex]]);
}

// ----------------------------
// Show all recipes
// ----------------------------
function showAllRecipes() {
  displayRecipes(recipes);
}

// ----------------------------
// Filter recipes by search
// ----------------------------
function filterRecipes(query) {
  query = query.toLowerCase();
  return recipes.filter(recipe => {
    const inName = recipe.name.toLowerCase().includes(query);
    const inDescription = recipe.description.toLowerCase().includes(query);
    const inTags = recipe.tags?.some(tag => tag.toLowerCase().includes(query));
    const inIngredients = recipe.ingredients?.some(ing => ing.toLowerCase().includes(query));
    return inName || inDescription || inTags || inIngredients;
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// ----------------------------
// Search input handler
// ----------------------------
searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  if (query.trim() === '') {
    recipesContainer.innerHTML = ''; // Clear if search is empty
  } else {
    const filtered = filterRecipes(query);
    displayRecipes(filtered);
  }
});

// ----------------------------
// Button click handlers
// ----------------------------
randomButton.addEventListener('click', showRandomRecipe);
allButton.addEventListener('click', showAllRecipes);

// Prevent form submission
document.querySelector('.search-form').addEventListener('submit', (e) => {
  e.preventDefault();
});
