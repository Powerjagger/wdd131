import { recipes } from './recipes.mjs';

const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('.search-form input');

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

  return article;
}

function displayRecipes(recipeList) {
  recipesContainer.innerHTML = ''; 
  recipeList.forEach(recipe => {
    recipesContainer.appendChild(createRecipeCard(recipe));
  });
}

displayRecipes(recipes);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(query) ||
    recipe.description.toLowerCase().includes(query)
  );
  displayRecipes(filtered);
});

document.querySelector('.search-form').addEventListener('submit', (e) => {
  e.preventDefault();
});
