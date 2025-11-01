// Get elements
const themeSelector = document.getElementById("theme-selector");
const body = document.body;
const logo = document.getElementById("logo");

// Function to change the theme
function changeTheme() {
  const theme = themeSelector.value;

  if (theme === "dark") {
    body.classList.add("dark");
    logo.src = "byui-logo_white.png"; 
  } else {
    body.classList.remove("dark");
    logo.src = "byui-logo_blue.webp"; 
  }
}

// Event listener
themeSelector.addEventListener("change", changeTheme);

// Set theme on load
changeTheme();
