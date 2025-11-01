// Reference to container
const articleContainer = document.querySelector("#articles");

// Function to render articles
function renderArticles(list) {
  list.forEach((item) => {
    const article = document.createElement("article");

    article.innerHTML = `
      <div class="article-details">
        <p><strong>Author:</strong> ${item.author}</p>
        <p><strong>Date:</strong> ${item.date}</p>
      </div>
      <div class="article-content">
        <h2>${item.title}</h2>
        <img src="${item.imgSrc}" alt="${item.imgAlt}">
        <p>${item.description}</p>
        <p><strong>Ages:</strong> ${item.ages}</p>
        <p><strong>Genre:</strong> ${item.genre}</p>
        <p class="stars">${item.stars}</p>
      </div>
    `;

    articleContainer.appendChild(article);
  });
}

// Render articles on page load
renderArticles(articles);
