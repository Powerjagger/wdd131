// ----- DOM Elements -----
const totalImpulsesEl = document.getElementById('totalImpulses');
const maxIntensityEl = document.getElementById('maxIntensity');
const topCategoryEl = document.getElementById('topCategory');
const adviceListEl = document.getElementById('adviceList');
const themeToggle = document.getElementById('themeToggle');

// ----- Load impulses from localStorage -----
const impulses = JSON.parse(localStorage.getItem('impulses')) || [];

// ----- Theme Toggle -----
if (themeToggle) {
  const darkMode = localStorage.getItem('theme') === 'dark';
  document.documentElement.classList.toggle('dark-mode', darkMode);
  themeToggle.textContent = darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';

  themeToggle.addEventListener('click', () => {
    const darkActive = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', darkActive ? 'dark' : 'light');
    themeToggle.textContent = darkActive ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// ----- Advice Library -----
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
    food: ["Food impulses are often emotional rather than physical hunger."],
    anger: ["Anger impulses often point to unmet needs or boundaries."],
    spending: ["Spending impulses can increase during stress. Consider delaying decisions."]
  }
};

// ----- Helpers -----
const isToday = dateString => {
  const d = new Date(dateString);
  const today = new Date();
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

// ----- Stats and Advice -----
function computeHomeData() {
  const todaysImpulses = impulses.filter(i => isToday(i.date));
  let maxIntensity = 0, topCategory = 'N/A';
  const categoryCount = {};

  todaysImpulses.forEach(i => {
    if (i.intensity > maxIntensity) maxIntensity = i.intensity;
    categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
  });

  const topCatEntry = Object.entries(categoryCount).reduce(
    (acc, [cat, count]) => count > acc[1] ? [cat, count] : acc,
    [null, 0]
  );

  if (topCatEntry[0]) topCategory = topCatEntry[0];

  // Generate advice
  const advice = [];
  if (todaysImpulses.length === 0) {
    advice.push("Log impulses today to receive personalized insight.");
  } else {
    if (maxIntensity >= 7) advice.push(pickRandom(adviceLibrary.highIntensity));
    if (todaysImpulses.length >= 5) advice.push(pickRandom(adviceLibrary.manyImpulses));
    if (todaysImpulses.length <= 1) advice.push(pickRandom(adviceLibrary.lowActivity));
    if (adviceLibrary.category[topCategory]) advice.push(pickRandom(adviceLibrary.category[topCategory]));
  }

  return {
    total: todaysImpulses.length,
    maxIntensity,
    topCategory,
    advice: advice.slice(0, 3)
  };
}

function renderHomeData() {
  // Use requestIdleCallback to avoid blocking render
  const render = () => {
    const data = computeHomeData();

    if (totalImpulsesEl) totalImpulsesEl.textContent = data.total;
    if (maxIntensityEl) maxIntensityEl.textContent = data.maxIntensity;
    if (topCategoryEl) topCategoryEl.textContent = data.topCategory;
    if (adviceListEl) adviceListEl.innerHTML = data.advice.map(a => `<li>${a}</li>`).join('');
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(render, { timeout: 500 });
  } else {
    setTimeout(render, 0);
  }
}

// ----- Initial Render -----
document.addEventListener('DOMContentLoaded', renderHomeData);
