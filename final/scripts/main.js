// ----- DOM Elements -----
const totalImpulsesEl = document.getElementById('totalImpulses');
const maxIntensityEl = document.getElementById('maxIntensity');
const topCategoryEl = document.getElementById('topCategory');
const themeToggle = document.getElementById('themeToggle');

// ----- Load impulses from localStorage -----
const impulses = JSON.parse(localStorage.getItem('impulses')) || [];

// ----- Update Home Page Stats -----
function updateHomeStats() {
  if (!totalImpulsesEl || !maxIntensityEl || !topCategoryEl) return;

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

// ----- Theme Toggle -----
if (themeToggle) {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light Mode';
  } else {
    themeToggle.textContent = '🌙 Dark Mode';
  }

  themeToggle.addEventListener('click', () => {
    const darkActive = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', darkActive ? 'dark' : 'light');
    themeToggle.textContent = darkActive ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// ----- Advice System -----
const adviceLibrary = {
  highIntensity: [
    "High-intensity impulses often pass if you pause before acting.",
    "Strong impulses can be a sign of stress. Slowing down may help today."
  ],
  manyImpulses: [
    "A high number of impulses today may indicate fatigue or emotional overload.",
    "Frequent impulses can be a signal to reduce pressure or expectations."
  ],
  lowActivity: [
    "A quiet day can be a positive sign of balance and awareness."
  ],
  category: {
    food: [
      "Food impulses are often emotional rather than physical hunger."
    ],
    anger: [
      "Anger impulses often point to unmet needs or boundaries."
    ],
    spending: [
      "Spending impulses can increase during stress. Consider delaying decisions."
    ]
  }
};

function isToday(dateString) {
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHomeAdvice(impulses) {
  const todaysImpulses = impulses.filter(i => isToday(i.date));
  const advice = [];

  if (todaysImpulses.length === 0) {
    return ["Log impulses today to receive personalized insight."];
  }

  const maxIntensity = Math.max(...todaysImpulses.map(i => i.intensity));

  if (maxIntensity >= 7) {
    advice.push(pickRandom(adviceLibrary.highIntensity));
  }

  if (todaysImpulses.length >= 5) {
    advice.push(pickRandom(adviceLibrary.manyImpulses));
  }

  if (todaysImpulses.length <= 1) {
    advice.push(pickRandom(adviceLibrary.lowActivity));
  }

  const categoryCount = {};
  todaysImpulses.forEach(i => {
    categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
  });

  const topCategory = Object.keys(categoryCount).reduce((a, b) =>
    categoryCount[a] > categoryCount[b] ? a : b
  );

  if (adviceLibrary.category[topCategory]) {
    advice.push(pickRandom(adviceLibrary.category[topCategory]));
  }

  return advice.slice(0, 3);
}

function renderHomeAdvice() {
  const adviceList = document.getElementById("adviceList");
  if (!adviceList) return;

  const advice = generateHomeAdvice(impulses);
  adviceList.innerHTML = advice.map(a => `<li>${a}</li>`).join("");
}

// ----- Initial Render -----
updateHomeStats();
renderHomeAdvice();
