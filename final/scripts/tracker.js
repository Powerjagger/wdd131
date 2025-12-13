// Get DOM elements
const form = document.getElementById('addForm');
const categoryInput = document.getElementById('category');
const intensityInput = document.getElementById('intensity');
const noteInput = document.getElementById('note');
const impulseList = document.getElementById('impulseList');
const warning = document.getElementById('warning');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-bar button[data-filter]');
const sortSelect = document.getElementById('sortSelect');
const clearBtn = document.getElementById('clearFilters');

// Load impulses from localStorage
let impulses = JSON.parse(localStorage.getItem('impulses')) || [];

// Current filter/search/sort
let currentFilter = 'All';
let currentSearch = '';
let currentSort = 'date';

// Render function
function render() {
  let filtered = [...impulses];

  // Apply category filter
  if (currentFilter !== 'All') filtered = filtered.filter(i => i.category === currentFilter);

  // Apply search filter
  if (currentSearch) {
    const query = currentSearch.toLowerCase();
    filtered = filtered.filter(i =>
      i.note.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (currentSort === 'intensity') filtered.sort((a, b) => a.intensity - b.intensity);
  else if (currentSort === 'category') filtered.sort((a, b) => a.category.localeCompare(b.category));
  else if (currentSort === 'date') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render HTML
  if (filtered.length === 0) impulseList.innerHTML = '<p>No impulses found.</p>';
  else {
    impulseList.innerHTML = filtered.map(i => `
      <div class="impulse-card ${currentSearch || currentFilter !== 'All' ? 'filtered' : ''}">
        <h3>${i.category}</h3>
        <p><strong>Intensity:</strong> ${i.intensity}</p>
        <p><strong>Note:</strong> ${i.note}</p>
        <p><strong>Date:</strong> ${new Date(i.date).toLocaleString()}</p>
      </div>
    `).join('');
  }
}

// Save to localStorage
function save() {
  localStorage.setItem('impulses', JSON.stringify(impulses));
}

// Add new impulse
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newImpulse = {
    category: categoryInput.value,
    intensity: parseInt(intensityInput.value),
    note: noteInput.value.trim(),
    date: new Date().toISOString()
  };

  // Optional warning
  warning.textContent = newImpulse.intensity >= 9 ? '⚠️ High intensity impulse!' : '';

  impulses.push(newImpulse);
  save();
  render();
  form.reset();
});

// Filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    render();
  });
});

// Search input
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value;
  render();
});

// Sort select
sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  render();
});

// Clear filters
clearBtn.addEventListener('click', () => {
  currentFilter = 'All';
  currentSearch = '';
  searchInput.value = '';
  render();
});

// Initial render
render();


const themeToggle = document.getElementById('themeToggle');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark-mode');
  themeToggle.textContent = '☀️ Light Mode';
} else {
  themeToggle.textContent = '🌙 Dark Mode';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');

  if (document.documentElement.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️ Light Mode';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙 Dark Mode';
  }
});

