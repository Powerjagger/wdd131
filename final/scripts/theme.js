// ========== GLOBAL THEME HANDLING ==========

// Apply dark mode immediately to avoid flicker
(function applyInitialTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
})();

// ========== THEME TOGGLE BUTTON LOGIC ==========

function setupThemeToggle(buttonId = "themeToggle") {
  const toggle = document.getElementById(buttonId);
  if (!toggle) return; // Exit if no toggle on page

  // Set initial button text
  toggle.textContent = document.documentElement.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

  // Toggle dark mode on click
  toggle.addEventListener("click", () => {
    const darkActive = document.documentElement.classList.toggle("dark-mode");

    // Save preference
    localStorage.setItem("theme", darkActive ? "dark" : "light");

    // Update button text
    toggle.textContent = darkActive ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}
