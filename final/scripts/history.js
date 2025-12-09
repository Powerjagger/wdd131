// ----- DOM Elements -----
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const totalImpulsesEl = document.getElementById('totalImpulses');
const maxIntensityEl = document.getElementById('maxIntensity');
const topCategoryEl = document.getElementById('topCategory');

const searchInput = document.getElementById('historySearch');
const filterButtons = document.querySelectorAll('.filter-bar button[data-filter]');
const sortSelect = document.getElementById('historySort');
const clearBtn = document.getElementById('clearFilters');
const deleteAllBtn = document.getElementById('deleteAll');

// ----- Load impulses -----
let impulses = JSON.parse(localStorage.getItem('impulses')) || [];

// ----- Current filter/search/sort -----
let currentFilter = 'All';
let currentSearch = '';
let currentSort = 'date';

// ----- Update summary -----
function updateSummary() {
  totalImpulsesEl.textContent = impulses.length;

  const max = impulses.reduce((acc, i) => Math.max(acc, i.intensity), 0);
  maxIntensityEl.textContent = max;

  const categoryCount = impulses.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  let topCategory = 'N/A';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      topCategory = cat;
      maxCount = count;
    }
  }
  topCategoryEl.textContent = topCategory;
}

// ----- Render history -----
function renderHistory() {
  let filtered = [...impulses];

  if (currentFilter !== 'All') filtered = filtered.filter(i => i.category === currentFilter);

  if (currentSearch) {
    const query = currentSearch.toLowerCase();
    filtered = filtered.filter(i =>
      i.note.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query)
    );
  }

  if (currentSort === 'intensity') filtered.sort((a, b) => a.intensity - b.intensity);
  else if (currentSort === 'category') filtered.sort((a, b) => a.category.localeCompare(b.category));
  else if (currentSort === 'date') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    historyList.innerHTML = '<p>No impulses found.</p>';
    return;
  }

  historyList.innerHTML = filtered.map((i, index) => `
    <div class="impulse-card">
      <span class="category-badge">${i.category}</span>
      <h3>${i.category}</h3>
      <p><strong>Intensity:</strong> ${i.intensity}</p>
      <p><strong>Note:</strong> ${i.note}</p>
      <p><strong>Date:</strong> ${new Date(i.date).toLocaleString()}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    </div>
  `).join('');

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      impulses.splice(idx, 1);
      localStorage.setItem('impulses', JSON.stringify(impulses));
      renderHistory();
    });
  });

  updateSummary();
}

// ----- Theme toggle -----
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️ Light Mode';
} else {
  themeToggle.textContent = '🌙 Dark Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️ Light Mode';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙 Dark Mode';
  }
});

// ----- Filter/Search/Sort -----
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    renderHistory();
  });
});

searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value;
  renderHistory();
});

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  renderHistory();
});

clearBtn.addEventListener('click', () => {
  currentFilter = 'All';
  currentSearch = '';
  currentSort = 'date';
  searchInput.value = '';
  sortSelect.value = 'date';
  renderHistory();
});

// ----- Delete all -----
deleteAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all impulses?')) {
    impulses = [];
    localStorage.setItem('impulses', JSON.stringify(impulses));
    renderHistory();
  }
});

// ----- Initial render -----
renderHistory();
