// Constants
const PI = 3.14;

// Function to calculate the area of a circle
function circleArea(radius) {
  // Return the correct area
  return radius * radius * PI;
}

// Test the function with different radii
let radius = 3;
let area = circleArea(radius);
console.log("Radius:", radius, "Area:", area);

radius = 4;
area = circleArea(radius);
console.log("Radius:", radius, "Area:", area);
