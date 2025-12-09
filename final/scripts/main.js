// ----- DOM Elements -----
const totalImpulsesEl = document.getElementById('totalImpulses');
const maxIntensityEl = document.getElementById('maxIntensity');
const topCategoryEl = document.getElementById('topCategory');
const themeToggle = document.getElementById('themeToggle');

// ----- Load impulses from localStorage -----
const impulses = JSON.parse(localStorage.getItem('impulses')) || [];

// ----- Update Home Page Stats -----
function updateHomeStats() {
  // Total impulses
  totalImpulsesEl.textContent = impulses.length;

  // Highest intensity
  const max = impulses.reduce((acc, i) => Math.max(acc, i.intensity), 0);
  maxIntensityEl.textContent = max;

  // Most common category
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

// ----- Initial Stats Render -----
updateHomeStats();

// ----- Theme Toggle -----

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️ Light Mode';
} else {
  themeToggle.textContent = '🌙 Dark Mode';
}

// Toggle theme on button click
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
